import { useState, useEffect, useRef } from "react";
import api from "../lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function useBattle(phase) {
  const router = useRouter();
  const [team, setTeam]           = useState([]);
  const [player, setPlayer]       = useState(null);
  const [enemy, setEnemy]         = useState(null);
  const [mustSwitch, setMustSwitch] = useState(false);
  const [lost, setLost]           = useState(false);
  const [victory, setVictory]     = useState(false);
  const prevEnemy                 = useRef(null);

  // Inicia a batalha para um UserPokemon (ou próximo vivo, se necessário)
  function startBattleWith(upId, keepEnemy = false) {
    const user = JSON.parse(Cookies.get("currentUser"));

    // Se não vamos manter o inimigo, e o Pokémon escolhido já está desmaiado,
    // encontra o próximo vivo na equipe.
    let selectedId = upId;
    if (!keepEnemy) {
      const chosen = team.find((u) => u.id === upId);
      if (!chosen || chosen.current_hp <= 0) {
        const nextAlive = team.find((u) => u.current_hp > 0);
        if (nextAlive) {
          selectedId = nextAlive.id;
        }
      }
    }

    api
      .post("/battle/start", {
        phase,
        userId: user.id,
        userPokemonId: selectedId,
      })
      .then(({ data }) => {
        // injeta apenas os golpes escolhidos pelo usuário
        const chosenMoves = user.moves_by_starter?.[selectedId] || [];
        const moves = data.userPokemon.moves.filter((m) =>
          chosenMoves.includes(m.id)
        );

        setPlayer({ ...data.userPokemon, moves });

        if (keepEnemy && prevEnemy.current) {
          setEnemy(prevEnemy.current);
        } else {
          setEnemy(data.enemyPokemon);
          prevEnemy.current = data.enemyPokemon;
        }

        setMustSwitch(false);
        setLost(false);
        setVictory(false);
      })
      .catch(console.error);
  }

  // Carrega o team e inicia com o primeiro Pokémon vivo
  useEffect(() => {
    const cookie = Cookies.get("currentUser");
    if (!cookie) return router.replace("/login");
    const user = JSON.parse(cookie);

    api
      .get(`/user_pokemons?user_id=${user.id}`)
      .then(({ data: ups }) => {
        setTeam(ups);
        if (ups.length) {
          // encontra o primeiro vivo
          const firstAlive = ups.find((u) => u.current_hp > 0) || ups[0];
          startBattleWith(firstAlive.id, false);
        }
      })
      .catch(console.error);
  }, [phase]);

  // Executa um ataque e trata desmaios, vitória e derrota
  function doAttack(moveId) {
    const user = JSON.parse(Cookies.get("currentUser"));

    api
      .post("/battle/attack", {
        userId: user.id,
        userPokemonId: player.id,
        enemyPokemon: enemy,
        moveId,
      })
      .then(({ data }) => {
        // atualiza o inimigo e o jogador
        setEnemy(data.enemyPokemon);
        setPlayer((p) => ({ ...p, currentHp: data.playerHp }));
        setTeam((t) =>
          t.map((u) =>
            u.id === player.id
              ? { ...u, current_hp: data.playerHp }
              : u
          )
        );
        prevEnemy.current = data.enemyPokemon;

        // se o jogador desmaiou
        if (data.playerHp <= 0) {
          const anyAlive = team.some(
            (u) => u.id !== player.id && u.current_hp > 0
          );
          if (anyAlive) {
            setMustSwitch(true);
          } else {
            api.post("/battle/lose", { userId: user.id });
            setLost(true);
            setTimeout(() => router.replace("/menu"), 2000);
          }
          return;
        }

        // se o inimigo desmaiou
        if (data.enemyHp <= 0) {
          // XP = level do inimigo × 50
          const xpGain = enemy.level * 50;
          api
            .post("/battle/finish", {
              userId: user.id,
              userPokemonId: player.id,
              xpGain,
            })
            .then(({ data: fin }) => {
              user.totalEnemiesKills = fin.totalEnemiesKills;
              Cookies.set("currentUser", JSON.stringify(user), {
                path: "/",
              });
              setPlayer((p) => ({
                ...p,
                level: fin.level,
                xp: fin.xp,
                currentHp: fin.currentHp,
              }));
              setVictory(true);
            });
        }
      })
      .catch(console.error);
  }

  // Troca de Pokémon em campo, reaproveitando o inimigo
  function switchPokemon(upId) {
    startBattleWith(upId, true);
  }

  return {
    team,
    player,
    enemy,
    doAttack,
    switchPokemon,
    mustSwitch,
    lost,
    victory,
  };
}
