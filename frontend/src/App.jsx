import { useState } from "react";
import "./App.css";


const API_URL = "http://localhost:8000";

const DDRAGON_VERSION = "15.18.1";


const championMap = {
  Aatrox: "Aatrox",
  Ahri: "Ahri",
  Akali: "Akali",
  Akshan: "Akshan",
  Alistar: "Alistar",
  Amumu: "Amumu",
  Anivia: "Anivia",
  Annie: "Annie",
  Aphelios: "Aphelios",
  Ashe: "Ashe",
  AurelionSol: "AurelionSol",
  Aurora: "Aurora",
  Azir: "Azir",
  Bard: "Bard",
  Belveth: "Belveth",
  Blitzcrank: "Blitzcrank",
  Brand: "Brand",
  Braum: "Braum",
  Briar: "Briar",
  Caitlyn: "Caitlyn",
  Camille: "Camille",
  Cassiopeia: "Cassiopeia",
  Chogath: "Chogath",
  Corki: "Corki",
  Darius: "Darius",
  Diana: "Diana",
  Draven: "Draven",
  DrMundo: "DrMundo",
  Ekko: "Ekko",
  Elise: "Elise",
  Evelynn: "Evelynn",
  Ezreal: "Ezreal",
  Fiddlesticks: "Fiddlesticks",
  Fiora: "Fiora",
  Fizz: "Fizz",
  Galio: "Galio",
  Gangplank: "Gangplank",
  Garen: "Garen",
  Gnar: "Gnar",
  Gragas: "Gragas",
  Graves: "Graves",
  Gwen: "Gwen",
  Hecarim: "Hecarim",
  Heimerdinger: "Heimerdinger",
  Hwei: "Hwei",
  Illaoi: "Illaoi",
  Irelia: "Irelia",
  Ivern: "Ivern",
  Janna: "Janna",
  JarvanIV: "JarvanIV",
  Jax: "Jax",
  Jayce: "Jayce",
  Jhin: "Jhin",
  Jinx: "Jinx",
  KSante: "KSante",
  Kalista: "Kalista",
  Karma: "Karma",
  Karthus: "Karthus",
  Kassadin: "Kassadin",
  Katarina: "Katarina",
  Kayle: "Kayle",
  Kayn: "Kayn",
  Kennen: "Kennen",
  Khazix: "Khazix",
  Kindred: "Kindred",
  Kled: "Kled",
  KogMaw: "KogMaw",
  LeBlanc: "Leblanc",
  LeeSin: "LeeSin",
  Leona: "Leona",
  Lillia: "Lillia",
  Lissandra: "Lissandra",
  Lucian: "Lucian",
  Lulu: "Lulu",
  Lux: "Lux",
  Malphite: "Malphite",
  Malzahar: "Malzahar",
  Maokai: "Maokai",
  MasterYi: "MasterYi",
  Mel: "Mel",
  Milio: "Milio",
  MissFortune: "MissFortune",
  Mordekaiser: "Mordekaiser",
  Morgana: "Morgana",
  Naafiri: "Naafiri",
  Nami: "Nami",
  Nasus: "Nasus",
  Nautilus: "Nautilus",
  Neeko: "Neeko",
  Nidalee: "Nidalee",
  Nilah: "Nilah",
  Nocturne: "Nocturne",
  Nunu: "Nunu",
  Olaf: "Olaf",
  Orianna: "Orianna",
  Ornn: "Ornn",
  Pantheon: "Pantheon",
  Poppy: "Poppy",
  Pyke: "Pyke",
  Qiyana: "Qiyana",
  Quinn: "Quinn",
  Rakan: "Rakan",
  Rammus: "Rammus",
  RekSai: "RekSai",
  Rell: "Rell",
  Renata: "Renata",
  Renekton: "Renekton",
  Rengar: "Rengar",
  Riven: "Riven",
  Rumble: "Rumble",
  Ryze: "Ryze",
  Samira: "Samira",
  Sejuani: "Sejuani",
  Senna: "Senna",
  Seraphine: "Seraphine",
  Sett: "Sett",
  Shaco: "Shaco",
  Shen: "Shen",
  Shyvana: "Shyvana",
  Singed: "Singed",
  Sion: "Sion",
  Sivir: "Sivir",
  Skarner: "Skarner",
  Smolder: "Smolder",
  Sona: "Sona",
  Soraka: "Soraka",
  Swain: "Swain",
  Sylas: "Sylas",
  Syndra: "Syndra",
  TahmKench: "TahmKench",
  Taliyah: "Taliyah",
  Talon: "Talon",
  Taric: "Taric",
  Teemo: "Teemo",
  Thresh: "Thresh",
  Tristana: "Tristana",
  Trundle: "Trundle",
  Tryndamere: "Tryndamere",
  TwistedFate: "TwistedFate",
  Twitch: "Twitch",
  Udyr: "Udyr",
  Urgot: "Urgot",
  Varus: "Varus",
  Vayne: "Vayne",
  Veigar: "Veigar",
  Velkoz: "Velkoz",
  Vex: "Vex",
  Vi: "Vi",
  Viego: "Viego",
  Viktor: "Viktor",
  Vladimir: "Vladimir",
  Volibear: "Volibear",
  Warwick: "Warwick",
  MonkeyKing: "MonkeyKing",
  Xayah: "Xayah",
  Xerath: "Xerath",
  XinZhao: "XinZhao",
  Yasuo: "Yasuo",
  Yone: "Yone",
  Yorick: "Yorick",
  Yunara: "Yunara",
  Yuumi: "Yuumi",
  Zac: "Zac",
  Zed: "Zed",
  Zeri: "Zeri",
  Ziggs: "Ziggs",
  Zilean: "Zilean",
  Zoe: "Zoe",
  Zyra: "Zyra",
};


function getChampionImage(champion) {

  if (!champion) {
    return "";
  }

  const key =
    championMap[champion] ||
    champion;

  return (
    `https://ddragon.leagueoflegends.com/cdn/` +
    `${DDRAGON_VERSION}/img/champion/${key}.png`
  );
}


function formatNumber(value) {

  return Number(
    value || 0
  ).toLocaleString();
}


function formatDifference(value) {

  const number =
    Number(value || 0);

  if (number > 0) {
    return `+${formatNumber(number)}`;
  }

  return formatNumber(number);
}


function differenceClass(value) {

  const number =
    Number(value || 0);

  if (number > 0) {
    return "positive";
  }

  if (number < 0) {
    return "negative";
  }

  return "";
}


function formatMinute(value) {

  const number =
    Number(value || 0);

  return `${number.toFixed(1)} MIN`;
}

const summonerSpellNames = {
  1: "SummonerBoost",
  3: "SummonerExhaust",
  4: "SummonerFlash",
  6: "SummonerHaste",
  7: "SummonerHeal",
  11: "SummonerSmite",
  12: "SummonerTeleport",
  13: "SummonerMana",
  14: "SummonerDot",
  21: "SummonerBarrier",
  32: "SummonerSnowball",
};

function getSpellImage(spellId) {
  const spell = summonerSpellNames[spellId];
  return spell
    ? `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${spell}.png`
    : "";
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return "최근 경기";
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (elapsedMinutes < 60) return `${elapsedMinutes}분 전`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}시간 전`;
  return `${Math.floor(elapsedHours / 24)}일 전`;
}

function formatQueueName(queueId) {
  return ({ 420: "솔로 랭크", 440: "자유 랭크", 430: "일반" })[queueId] || "소환사의 협곡";
}


function App() {

  const [gameName, setGameName] =
    useState("");

  const [tagLine, setTagLine] =
    useState("");

  const [player, setPlayer] =
    useState(null);

  const [selectedMatch, setSelectedMatch] =
    useState(null);

  const [detailTab, setDetailTab] =
    useState("summary");

  const [analysis, setAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [analysisLoading, setAnalysisLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // =========================
  // Champion Image
  // =========================

  const renderChampionImage = (
    champion,
    className = "champion-image"
  ) => {

    if (!champion) {

      return (
        <div
          className={
            `${className} champion-placeholder`
          }
        >
          ?
        </div>
      );
    }

    return (
      <img
        className={className}
        src={getChampionImage(champion)}
        alt={champion}
        onError={(event) => {
          event.currentTarget.style.display =
            "none";
        }}
      />
    );
  };


  // =========================
  // Search
  // =========================

  const searchPlayer = async () => {

    if (
      !gameName.trim() ||
      !tagLine.trim()
    ) {

      setError(
        "Riot ID를 입력해주세요."
      );

      return;
    }


    setLoading(true);

    setError("");

    setPlayer(null);

    setSelectedMatch(null);

    setAnalysis(null);


    try {

      const response =
        await fetch(
          `${API_URL}/matches/` +
          `${encodeURIComponent(
            gameName.trim()
          )}/` +
          `${encodeURIComponent(
            tagLine.trim()
          )}`
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "검색에 실패했습니다."
        );
      }


      setPlayer(data);

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "서버에 연결할 수 없습니다."
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================
  // Open Match
  // =========================

  const openMatch = async (match) => {
    if (!match?.match_id || !player?.puuid) {
      setError("경기 정보를 확인할 수 없습니다.");
      return;
    }

    setSelectedMatch(match);
    setDetailTab("summary");
    setAnalysis(null);
    setAnalysisLoading(true);
    setError("");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(
        `${API_URL}/analysis/${encodeURIComponent(match.match_id)}?puuid=${encodeURIComponent(player.puuid)}`,
        { signal: controller.signal }
      );

      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { detail: raw };
      }

      if (!response.ok) {
        throw new Error(data.detail || `경기 분석 요청 실패 (${response.status})`);
      }

      if (!data?.match?.player) {
        throw new Error("서버에서 경기 분석 데이터를 받았지만 형식이 올바르지 않습니다.");
      }

      setAnalysis(data);
    } catch (error) {
      console.error("[LoL Analyzer] match analysis error:", error);
      if (error?.name === "AbortError") {
        setError("경기 데이터 요청 시간이 초과되었습니다. FastAPI 서버가 실행 중인지 확인해주세요.");
      } else {
        setError(error?.message || "경기 분석에 실패했습니다.");
      }
    } finally {
      clearTimeout(timeout);
      setAnalysisLoading(false);
    }
  };

  const retryMatch = () => {
    if (selectedMatch) openMatch(selectedMatch);
  };


  const closeAnalysis = () => {

    setSelectedMatch(null);

    setAnalysis(null);

    setError("");
  };


  // =========================
  // Timeline
  // =========================

  const renderTimeline = () => {

    if (!analysis?.timeline) {
      return null;
    }


    const timeline =
      analysis.timeline;

    const details =
      timeline.details || {};


    const events = [];


    if (timeline.first_blood) {

      events.push({

        key: "first-blood",

        minute:
          Number(
            timeline.first_blood.minute
          ) || 0,

        type: "FIRST BLOOD",

        title: "First Blood",

        description:
          "첫 킬이 발생했습니다.",

        className: "first-blood",
      });
    }


    if (
      details.dragon_details
    ) {

      details.dragon_details.forEach(
        (dragon, index) => {

          events.push({

            key:
              `dragon-${index}`,

            minute:
              Number(
                dragon.minute
              ) || 0,

            type: "DRAGON",

            title:
              dragon.dragon_type ||
              "Dragon",

            description:
              dragon.my_team
                ? "우리 팀이 처치했습니다."
                : "상대 팀이 처치했습니다.",

            className: "dragon",
          });
        }
      );
    }


    if (
      details.rift_herald_details
    ) {

      details.rift_herald_details.forEach(
        (herald, index) => {

          events.push({

            key:
              `herald-${index}`,

            minute:
              Number(
                herald.minute
              ) || 0,

            type: "HERALD",

            title:
              "Rift Herald",

            description:
              herald.my_team
                ? "우리 팀이 처치했습니다."
                : "상대 팀이 처치했습니다.",

            className: "herald",
          });
        }
      );
    }


    if (
      details.baron_details
    ) {

      details.baron_details.forEach(
        (baron, index) => {

          events.push({

            key:
              `baron-${index}`,

            minute:
              Number(
                baron.minute
              ) || 0,

            type: "BARON",

            title:
              "Baron Nashor",

            description:
              baron.my_team
                ? "우리 팀이 처치했습니다."
                : "상대 팀이 처치했습니다.",

            className: "baron",
          });
        }
      );
    }


    if (
      details.turret_details
    ) {

      details.turret_details.forEach(
        (tower, index) => {

          events.push({

            key:
              `tower-${index}`,

            minute:
              Number(
                tower.minute
              ) || 0,

            type: "TURRET",

            title:
              "Turret Destroyed",

            description:
              `${tower.lane || "UNKNOWN"} · ` +
              `${tower.tower_type || "TOWER"}` +
              `${
                tower.participated
                  ? " · 참여"
                  : ""
              }`,

            className: "tower",
          });
        }
      );
    }


    if (
      details.first_item_purchase
    ) {

      events.push({

        key: "first-item",

        minute:
          Number(
            details
              .first_item_purchase
              .minute
          ) || 0,

        type: "ITEM",

        title:
          "First Item Purchase",

        description:
          `Item ID ${
            details
              .first_item_purchase
              .item_id
          }`,

        className: "item",
      });
    }


    events.sort(
      (a, b) =>
        a.minute - b.minute
    );


    if (events.length === 0) {

      return (
        <div className="empty-analysis">
          타임라인 이벤트가 없습니다.
        </div>
      );
    }


    return (
      <div className="timeline">

        {events.map(
          (event) => (

            <div
              className="timeline-item"
              key={event.key}
            >

              <div className="timeline-time">
                {formatMinute(
                  event.minute
                )}
              </div>

              <div
                className={
                  `timeline-dot ` +
                  event.className
                }
              />

              <div className="timeline-event-card">

                <div className="timeline-event-top">

                  <span className="timeline-event-type">
                    {event.type}
                  </span>

                  <strong>
                    {event.title}
                  </strong>

                </div>

                <span className="timeline-event-description">
                  {event.description}
                </span>

              </div>

            </div>
          )
        )}

      </div>
    );
  };


  // =========================
  // OP.GG style helpers
  // =========================

  const getItemImage = (itemId) => {
    if (!itemId || Number(itemId) === 0) return null;
    return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item/${itemId}.png`;
  };

  const renderItems = (items = [], limit = 6) => {
    const visible = items.slice(0, limit);
    return (
      <div className="match-item-icons">
        {visible.map((item, index) => {
          const itemId = typeof item === "number" ? item : item.item_id;
          const src = getItemImage(itemId);
          if (!src) {
            return <span className="empty-item" key={`${itemId}-${index}`} />;
          }
          return (
            <img
              key={`${itemId}-${item.timestamp || index}`}
              src={src}
              alt={`item ${itemId}`}
              className="match-item-icon"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          );
        })}
      </div>
    );
  };

  const getMatchScore = (participant, teamPlayers) => {
    const teamKills = teamPlayers.reduce((total, teammate) => total + Number(teammate.kills || 0), 0);
    const teamDamage = teamPlayers.reduce((total, teammate) => total + Number(teammate.damage || 0), 0);
    const teamDamageTaken = teamPlayers.reduce((total, teammate) => total + Number(teammate.damage_taken || 0), 0);
    const teamGold = teamPlayers.reduce((total, teammate) => total + Number(teammate.gold || 0), 0);
    const durationMinutes = Math.max(Number(detailGame.duration_seconds || 0) / 60, 1);
    const kda = (Number(participant.kills || 0) + Number(participant.assists || 0)) / Math.max(Number(participant.deaths || 0), 1);
    const killParticipation = teamKills ? (Number(participant.kills || 0) + Number(participant.assists || 0)) / teamKills * 100 : 0;
    const damageShare = teamDamage ? Number(participant.damage || 0) / teamDamage * 100 : 0;
    const goldShare = teamGold ? Number(participant.gold || 0) / teamGold * 100 : 0;
    const csPerMinute = Number(participant.cs || 0) / durationMinutes;
    const visionPerMinute = Number(participant.vision || 0) / durationMinutes;
    const score = 3.5
      + Math.min(kda, 8) * 0.25
      + killParticipation * 0.015
      + damageShare * 0.02
      + goldShare * 0.01
      + Math.min(csPerMinute, 10) * 0.12
      + Math.min(visionPerMinute, 10) * 0.1;

    return {
      score: Math.min(10, score),
      killParticipation,
      damageShare,
      damageTakenShare: teamDamageTaken ? Number(participant.damage_taken || 0) / teamDamageTaken * 100 : 0,
      csPerMinute,
    };
  };

  const renderScoreRow = ({
    side,
    name,
    champion,
    position,
    kills,
    deaths,
    assists,
    cs,
    damage,
    vision,
    damageTaken,
    wardsPlaced,
    wardsKilled,
    championLevel,
    spell1Id,
    spell2Id,
    items,
    opScore,
    result,
    killParticipation,
    damageShare,
    damageTakenShare,
    csPerMinute,
    ace = false,
    highlight = false,
  }) => (
    <div className={`score-row ${side === "blue" ? "score-blue" : "score-red"} score-${result} ${highlight ? "score-highlight" : ""}`}>
      <div className="score-op-score">
        <strong>{opScore.toFixed(1)}</strong>
        <span>{ace ? "ACE" : ""}</span>
      </div>

      <div className="score-player">
        <div className="score-player-visual">
          {renderChampionImage(champion, "score-champion")}
          <span className="score-level">{championLevel || 0}</span>
          <div className="score-spells">
            {getSpellImage(spell1Id) && <img src={getSpellImage(spell1Id)} alt="주문 1" />}
            {getSpellImage(spell2Id) && <img src={getSpellImage(spell2Id)} alt="주문 2" />}
          </div>
        </div>
        <div className="score-player-copy">
          <strong>{name || "상대 라이너"}</strong>
          <span>{position || "LANE"}</span>
        </div>
      </div>

      <div className="score-kda">
        <strong>{kills} / {deaths} / {assists} <small>({Math.round(killParticipation)}%)</small></strong>
        <span>{((Number(kills || 0) + Number(assists || 0)) / Math.max(Number(deaths || 0), 1)).toFixed(2)} KDA</span>
      </div>

      <div className="score-damage">
        <div><span>{formatNumber(damage)}</span><span>{formatNumber(damageTaken)}</span></div>
        <div className="score-damage-bars">
          <i><b style={{ width: `${Math.min(damageShare, 100)}%` }} /></i>
          <i><b className="taken" style={{ width: `${Math.min(damageTakenShare, 100)}%` }} /></i>
        </div>
      </div>

      <div className="score-wards">
        <strong>{vision ?? 0}</strong>
        <span>{wardsPlaced ?? 0} / {wardsKilled ?? 0}</span>
      </div>

      <div className="score-cs">
        <strong>{cs ?? 0}</strong>
        <span>{Number(csPerMinute || 0).toFixed(1)}</span>
      </div>

      {renderItems(items || [])}
    </div>
  );

  // =========================
  // Render
  // =========================

  const detailMatch = analysis?.match || {};
  const detailPlayer = detailMatch.player || {};
  const detailGame = detailMatch.game || {};
  const detailOpponent = detailMatch.opponent || null;
  const detailTimeline = analysis?.timeline || {};
  const detailDetails = detailTimeline.details || {};
  const detailAnalysis = analysis?.analysis || {};
  const detailCombat = detailAnalysis.combat || {};
  const detailObjectives = detailAnalysis.objectives || {};
  const detailLane = detailAnalysis.timeline?.lane || null;
  const detailCs = detailPlayer.cs || {};
  const detailDamage = detailPlayer.damage || {};
  const detailGold = detailPlayer.gold || {};
  const detailVision = detailPlayer.vision || {};
  const participants = detailMatch.participants || [];
  const teamIds = [...new Set(participants.map((participant) => participant.team_id))].sort((a, b) => a - b);
  const roleOrder = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];
  const scoreboardTeams = teamIds.map((teamId) => {
    const teamPlayers = participants.filter((participant) => participant.team_id === teamId);
    const players = teamPlayers.map((participant) => ({
      ...participant,
      ...getMatchScore(participant, teamPlayers),
    }));
    players.sort((a, b) => detailTab === "op-score"
      ? b.score - a.score
      : roleOrder.indexOf(a.position) - roleOrder.indexOf(b.position));

    return {
      teamId,
      win: teamPlayers[0]?.win ?? false,
      players,
    };
  });
  const aceParticipant = scoreboardTeams
    .filter((team) => team.win)
    .flatMap((team) => team.players)
    .sort((a, b) => b.score - a.score)[0];

  return (
    <div className="app opgg-app">
      <main className="container">

        <header className="header opgg-header">
          <button className="logo logo-button" onClick={closeAnalysis} aria-label="LoL Analyzer 홈">
            <span className="logo-mark" aria-hidden="true"><span>L</span><i /></span>
            <span className="logo-wordmark">
              <strong>LOL</strong>
              <i aria-hidden="true">/</i>
              <b>ANALYZER</b>
            </span>
          </button>
          <div className="header-description">데이터로 보는 나의 LoL 플레이</div>
        </header>

        {!selectedMatch && (
          <section className="search-section opgg-search">
            <div className="search-title">
              <span className="eyebrow">SUMMONER SEARCH</span>
              <h1>소환사 전적 검색</h1>
              <p>Riot ID를 입력하면 최근 경기와 플레이 데이터를 확인할 수 있습니다.</p>
            </div>

            <form
              className="search-box search-console"
              onSubmit={(event) => {
                event.preventDefault();
                searchPlayer();
              }}
            >
              <label className="search-field">
                <span>RIOT ID</span>
                <input
                  type="text"
                  placeholder="소환사 이름"
                  value={gameName}
                  onChange={(event) => setGameName(event.target.value)}
                />
              </label>
              <span className="search-tag-mark" aria-hidden="true">#</span>
              <label className="search-field search-tag-field">
                <span>TAGLINE</span>
                <input
                  type="text"
                  placeholder="KR1"
                  value={tagLine}
                  onChange={(event) => setTagLine(event.target.value)}
                />
              </label>
              <button type="submit" disabled={loading}>
                <span>{loading ? "검색 중..." : "검색"}</span>
                {!loading && <span className="search-submit-arrow" aria-hidden="true">→</span>}
              </button>
            </form>

            {error && (
              <div className="detail-error-card">
                <div>
                  <span className="error-kicker">REQUEST ERROR</span>
                  <strong>{error}</strong>
                  <p>상세 경기 데이터를 다시 요청해보세요. 서버가 실행 중이고 Riot API 키가 유효한지도 확인해주세요.</p>
                </div>
                <button onClick={retryMatch} disabled={analysisLoading}>다시 불러오기</button>
              </div>
            )}
          </section>
        )}

        {player && !selectedMatch && (
          <section className="results opgg-results">
            <div className="opgg-tabs">
              <button className="active">전체</button>
              <button>개인/2인 랭크 게임</button>
              <button>자유 랭크 게임</button>
              <button>일반</button>
            </div>

            <div className="results-layout">
              <aside className="profile-sidebar">
                <div className="sidebar-card profile-card">
                  <span className="sidebar-label">SUMMONER</span>
                  <h2>{player.riot_id}</h2>
                  <div className="profile-mini-stats">
                    <div><strong>{player.total_matches}</strong><span>최근 경기</span></div>
                    <div><strong>{player.statistics?.win_rate ?? 0}%</strong><span>승률</span></div>
                  </div>
                </div>

                <div className="sidebar-card">
                  <div className="sidebar-title">최근 성적</div>
                  <div className="sidebar-stat-big">
                    <strong>{player.statistics?.average_kda ?? 0}</strong>
                    <span>평균 KDA</span>
                  </div>
                  <div className="sidebar-progress"><span style={{ width: `${player.statistics?.win_rate ?? 0}%` }} /></div>
                  <div className="sidebar-stat-line">
                    <span>승률</span>
                    <strong>{player.statistics?.win_rate ?? 0}%</strong>
                  </div>
                  <div className="sidebar-stat-line">
                    <span>CS/min</span>
                    <strong>{player.statistics?.average_cs_per_minute ?? 0}</strong>
                  </div>
                </div>

                <div className="sidebar-card">
                  <div className="sidebar-title">챔피언</div>
                  <div className="sidebar-champion-list">
                    {(player.statistics?.champions || []).slice(0, 7).map((champion) => (
                      <div className="sidebar-champion-row" key={champion.champion}>
                        {renderChampionImage(champion.champion, "sidebar-champion-image")}
                        <div><strong>{champion.champion}</strong><span>{champion.games}게임 · {champion.win_rate}%</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              <section className="match-feed">
                <div className="feed-header">
                  <div>
                    <span className="eyebrow">RECENT MATCHES</span>
                    <h2>최근 경기</h2>
                  </div>
                  <span>{player.total_matches} GAMES</span>
                </div>

                {player.matches.map((match) => {
                  const roster = match.participants || [];
                  const currentParticipant = roster.find((participant) => participant.is_player);
                  const currentTeamId = currentParticipant?.team_id;
                  const laneOrder = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];
                  const allies = roster
                    .filter((participant) => participant.team_id === currentTeamId)
                    .sort((a, b) => laneOrder.indexOf(a.position) - laneOrder.indexOf(b.position));
                  const enemies = roster
                    .filter((participant) => participant.team_id !== currentTeamId)
                    .sort((a, b) => laneOrder.indexOf(a.position) - laneOrder.indexOf(b.position));

                  return (
                    <button
                      className={`feed-match ${match.win ? "feed-win" : "feed-loss"}`}
                      key={match.match_id}
                      onClick={() => openMatch(match)}
                    >
                      <div className="feed-result">
                        <strong>{match.win ? "승리" : "패배"}</strong>
                        <span>{formatQueueName(match.queue_id)}</span>
                        <small>{match.duration}분 · {formatRelativeTime(match.game_creation)}</small>
                      </div>
                      <div className="feed-champion">
                        {renderChampionImage(match.champion, "feed-champion-image")}
                        <div><strong>{match.champion}</strong><span>{match.position || "UNKNOWN"}</span></div>
                      </div>
                      <div className="feed-kda">
                        <strong>{match.kills} / {match.deaths} / {match.assists}</strong>
                        <span>{match.kda === "Perfect" ? "Perfect" : `${match.kda} : 1 평점`}</span>
                      </div>
                      <div className="feed-summary-stats">
                        <div><span>CS</span><strong>{match.cs}</strong><small>{match.cs_per_minute} /분</small></div>
                        <div><span>피해량</span><strong>{formatNumber(match.damage)}</strong></div>
                        <div><span>골드</span><strong>{formatNumber(match.gold)}</strong></div>
                      </div>
                      <div className="feed-rosters">
                        {[allies, enemies].map((team, teamIndex) => (
                          <div className={`feed-roster ${teamIndex ? "feed-roster-enemy" : ""}`} key={`${match.match_id}-${teamIndex}`}>
                            {team.map((participant, index) => (
                              <div className={participant.is_player ? "feed-roster-current" : ""} key={`${participant.team_id}-${index}`} title={`${participant.summoner_name || "소환사"} · ${participant.champion}`}>
                                {renderChampionImage(participant.champion, "feed-roster-champion")}
                                <span>{participant.summoner_name || participant.champion}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="feed-build">{renderItems(currentParticipant?.items || [], 7)}</div>
                      <div className="feed-arrow">⌄</div>
                    </button>
                  );
                })}
              </section>
            </div>
          </section>
        )}

        {selectedMatch && (
          <section className="match-detail-page">
            <button className="detail-back" onClick={closeAnalysis}>← 최근 경기</button>

            {analysisLoading && (
              <div className="analysis-loading match-loading-card">
                <div className="loading-spinner" />
                <div>
                  <span className="eyebrow">MATCH ANALYSIS</span>
                  <h2>경기 데이터 불러오는 중...</h2>
                  <p>Riot API에서 경기 상세 정보와 타임라인을 가져오고 있습니다.</p>
                </div>
                <div className="loading-progress"><span /></div>
              </div>
            )}

            {analysis && (
              <>
                <div className={`detail-hero ${detailGame.win ? "hero-win" : "hero-loss"}`}>
                  <div className="hero-result">
                    <span>{detailGame.win ? "승리" : "패배"}</span>
                    <strong>{(detailGame.duration_minutes ?? detailGame.duration ?? selectedMatch?.duration ?? 0)}분</strong>
                    <small>{formatQueueName(detailGame.queue_id)}</small>
                  </div>

                  <div className="hero-player">
                    {renderChampionImage(detailPlayer.champion, "hero-champion")}
                    <div>
                      <span>{detailPlayer.position || "UNKNOWN"}</span>
                      <h1>{detailPlayer.champion}</h1>
                      <p>{detailPlayer.summoner_name || player?.riot_id}</p>
                    </div>
                  </div>

                  <div className="hero-kda">
                    <strong>{(detailPlayer.kills ?? 0)} / {(detailPlayer.deaths ?? 0)} / {(detailPlayer.assists ?? 0)}</strong>
                    <span>{(detailPlayer.kda ?? 0)} : 1 평점</span>
                    <small>킬 관여 {(detailPlayer.kill_participation ?? 0)}%</small>
                  </div>

                  {detailOpponent && (
                    <div className="hero-opponent">
                      <span>상대 라이너</span>
                      {renderChampionImage(detailOpponent.champion, "hero-opponent-image")}
                      <strong>{detailOpponent.champion}</strong>
                      <small>{detailOpponent.position || "UNKNOWN"}</small>
                    </div>
                  )}
                </div>

                <nav className="detail-nav">
                  {[
                    ["summary", "종합"],
                    ["op-score", "OP 스코어"],
                    ["team-analysis", "팀 분석"],
                    ["build-analysis", "빌드"],
                    ["misc", "기타"],
                  ].map(([id, label]) => (
                    <button className={detailTab === id ? "active" : ""} key={id} onClick={() => setDetailTab(id)}>{label}</button>
                  ))}
                </nav>

                {(detailTab === "summary" || detailTab === "op-score") && (
                  <>
                    {detailTab === "summary" && (
                      <section className="detail-panel summary-panel">
                        <div className="detail-metric-grid">
                          <div><span>KDA</span><strong>{detailPlayer.kda ?? 0}</strong><small>{detailPlayer.kills ?? 0} / {detailPlayer.deaths ?? 0} / {detailPlayer.assists ?? 0}</small></div>
                          <div><span>킬 관여</span><strong>{detailPlayer.kill_participation ?? 0}%</strong><small>팀 킬 참여 비율</small></div>
                          <div><span>CS</span><strong>{detailCs.total ?? 0}</strong><small>{detailCs.per_minute ?? 0} CS/min</small></div>
                          <div><span>피해량</span><strong>{formatNumber(detailDamage.champions ?? 0)}</strong><small>챔피언 피해량</small></div>
                          <div><span>골드</span><strong>{formatNumber(detailGold.earned ?? 0)}</strong><small>획득 골드</small></div>
                          <div><span>시야</span><strong>{detailVision.score ?? 0}</strong><small>와드 {detailVision.wards_placed ?? 0} / {detailVision.wards_killed ?? 0}</small></div>
                        </div>
                      </section>
                    )}

                    <section className="detail-panel scoreboard-panel">
                      <div className="panel-heading">
                        <div><span>MATCH SCOREBOARD</span><h2>{detailTab === "summary" ? "경기 전적" : "OP 스코어 순위"}</h2></div>
                        <p>점수는 경기 내 지표를 조합한 자체 참고값입니다.</p>
                      </div>
                      <div className="scoreboard-scroll">
                        <div className="scoreboard-head">
                          <span>OP Score</span><span>플레이어</span><span>KDA</span><span>피해량</span><span>와드</span><span>CS</span><span>아이템</span>
                        </div>
                        <div className="team-total-bars">
                          {[
                            {
                              label: "총 킬",
                              left: scoreboardTeams[0]?.players.reduce((total, participant) => total + Number(participant.kills || 0), 0) || 0,
                              right: scoreboardTeams[1]?.players.reduce((total, participant) => total + Number(participant.kills || 0), 0) || 0,
                              format: (value) => formatNumber(value),
                            },
                            {
                              label: "총 골드",
                              left: scoreboardTeams[0]?.players.reduce((total, participant) => total + Number(participant.gold || 0), 0) || 0,
                              right: scoreboardTeams[1]?.players.reduce((total, participant) => total + Number(participant.gold || 0), 0) || 0,
                              format: (value) => formatNumber(value),
                            },
                          ].map(({ label, left, right, format }) => {
                            const total = left + right || 1;
                            return (
                              <div className="team-total-row" key={label}>
                                <strong>{format(left)}</strong>
                                <div className="team-total-track blue"><span style={{ width: `${left / total * 100}%` }} /></div>
                                <b>{label}</b>
                                <div className="team-total-track red"><span style={{ width: `${right / total * 100}%` }} /></div>
                                <strong>{format(right)}</strong>
                              </div>
                            );
                          })}
                        </div>
                        <div className="scoreboard-body">
                          {scoreboardTeams.map((team) => (
                            <div className={`score-team ${team.win ? "score-team-win" : "score-team-loss"}`} key={team.teamId}>
                              <div className="score-team-summary">
                                <strong className={`score-outcome-badge ${team.win ? "is-win" : "is-loss"}`}>{team.win ? "승리" : "패배"}</strong>
                                <span className="score-team-side">{team.teamId === detailPlayer.team_id ? "내 팀" : "상대 팀"} · {team.teamId === 100 ? "블루팀" : "레드팀"}</span>
                                <span>팀 킬 <b>{team.players.reduce((total, participant) => total + Number(participant.kills || 0), 0)}</b></span>
                                <span>팀 골드 <b>{formatNumber(team.players.reduce((total, participant) => total + Number(participant.gold || 0), 0))}</b></span>
                              </div>
                              {team.players.map((participant) => renderScoreRow({
                                side: team.teamId === teamIds[0] ? "blue" : "red",
                                name: participant.summoner_name,
                                champion: participant.champion,
                                position: participant.position,
                                championLevel: participant.champion_level,
                                spell1Id: participant.spell1_id,
                                spell2Id: participant.spell2_id,
                                kills: participant.kills,
                                deaths: participant.deaths,
                                assists: participant.assists,
                                cs: participant.cs,
                                damage: participant.damage,
                                damageTaken: participant.damage_taken,
                                vision: participant.vision,
                                wardsPlaced: participant.wards_placed,
                                wardsKilled: participant.wards_killed,
                                items: participant.items,
                                opScore: participant.score,
                                result: team.win ? "win" : "loss",
                                killParticipation: participant.killParticipation,
                                damageShare: participant.damageShare,
                                damageTakenShare: participant.damageTakenShare,
                                csPerMinute: participant.csPerMinute,
                                ace: participant.is_player === aceParticipant?.is_player
                                  && participant.summoner_name === aceParticipant?.summoner_name
                                  && participant.team_id === aceParticipant?.team_id,
                                highlight: participant.is_player,
                              }))}
                            </div>
                          ))}
                        </div>
                      </div>
                      {!participants.length && (
                        <div className="scoreboard-note">전체 참가자 데이터를 불러올 수 없습니다.</div>
                      )}
                    </section>
                  </>
                )}

                {detailTab === "team-analysis" && (
                  <>
                    <section id="lane-analysis" className="detail-panel">
                      <div className="panel-heading"><div><span>LANE MATCHUP</span><h2>라인전 데이터</h2></div><p>Riot 타임라인 프레임의 같은 포지션 상대 비교</p></div>
                      {detailLane ? (
                        <>
                          <div className="lane-matchup-banner">
                            {renderChampionImage(detailPlayer.champion, "lane-matchup-image")}
                            <strong>{detailPlayer.champion}</strong>
                            <span>VS</span>
                            {detailOpponent && renderChampionImage(detailOpponent.champion, "lane-matchup-image")}
                            <strong>{detailOpponent?.champion || "상대 라이너 정보 없음"}</strong>
                            <small>{detailPlayer.position || "라인 미확인"}</small>
                          </div>
                          <div className="lane-comparison-grid">
                            {["10_minutes", "15_minutes"].map((key) => {
                              const data = detailLane[key] || { cs_difference: 0, gold_difference: 0 };
                              const frameData = detailTimeline.lane_comparison?.[key] || {};
                              const playerStats = frameData.player || {};
                              const opponentStats = frameData.opponent || {};
                              return (
                                <div className="lane-time-card" key={key}>
                                  <div className="lane-time-title">{key === "10_minutes" ? "10분 성장" : "15분 성장"}</div>
                                  <div className="lane-growth-values">
                                    <span>내 CS <strong>{playerStats.cs ?? "-"}</strong></span>
                                    <span>상대 CS <strong>{opponentStats.cs ?? "-"}</strong></span>
                                    <strong className={differenceClass(data.cs_difference)}>{formatDifference(data.cs_difference)} CS</strong>
                                  </div>
                                  <div className="lane-growth-values">
                                    <span>내 골드 <strong>{formatNumber(playerStats.gold)}</strong></span>
                                    <span>상대 골드 <strong>{formatNumber(opponentStats.gold)}</strong></span>
                                    <strong className={differenceClass(data.gold_difference)}>{formatDifference(data.gold_difference)}</strong>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : <div className="empty-analysis">같은 포지션 상대 또는 타임라인 프레임을 찾을 수 없습니다.</div>}
                    </section>

                    <section id="combat-analysis" className="detail-panel">
                      <div className="panel-heading"><div><span>COMBAT</span><h2>전투 기록</h2></div><p>교전 기여도와 전투 수치</p></div>
                      <div className="combat-grid">
                        <div><span>킬 관여율</span><strong>{detailCombat.kill_participation ?? 0}%</strong></div>
                        <div><span>킬</span><strong>{detailCombat.kills ?? 0}</strong></div>
                        <div><span>데스</span><strong>{detailCombat.deaths ?? 0}</strong></div>
                        <div><span>어시스트</span><strong>{detailCombat.assists ?? 0}</strong></div>
                        <div><span>가한 피해</span><strong>{formatNumber(detailCombat.damage_dealt ?? 0)}</strong></div>
                        <div><span>받은 피해</span><strong>{formatNumber(detailCombat.damage_taken ?? 0)}</strong></div>
                      </div>
                    </section>

                    <section id="objective-analysis" className="detail-panel">
                      <div className="panel-heading"><div><span>OBJECTIVES</span><h2>오브젝트</h2></div><p>드래곤 · 전령 · 바론 · 포탑</p></div>
                      <div className="objective-cards">
                        <div><span>DRAGON</span><strong>{detailObjectives.dragon_count ?? 0}</strong><small>{(detailDetails?.dragon_details || []).map((d) => `${d.minute}분 ${d.dragon_type || ""}`).join(" · ") || "기록 없음"}</small></div>
                        <div><span>HERALD</span><strong>{detailObjectives.rift_herald_count ?? 0}</strong><small>{(detailDetails?.rift_herald_details || []).map((d) => `${d.minute}분`).join(" · ") || "기록 없음"}</small></div>
                        <div><span>BARON</span><strong>{detailObjectives.baron_count ?? 0}</strong><small>{(detailDetails?.baron_details || []).map((d) => `${d.minute}분`).join(" · ") || "기록 없음"}</small></div>
                        <div><span>TURRET</span><strong>{detailObjectives.tower_count ?? 0}</strong><small>포탑 관련 이벤트</small></div>
                      </div>
                    </section>
                  </>
                )}

                {detailTab === "build-analysis" && <section id="build-analysis" className="detail-panel">
                  <div className="panel-heading"><div><span>BUILD</span><h2>아이템 구매</h2></div><p>구매 순서와 구매 시점을 확인합니다.</p></div>
                  {(detailTimeline.items || [])?.length ? (
                    <div className="build-timeline">
                      {(detailTimeline.items || []).map((item, index) => (
                        <div className={`build-item ${index === 0 ? "first-build" : ""}`} key={`${item.item_id}-${item.timestamp}-${index}`}>
                          {getItemImage(item.item_id) ? <img src={getItemImage(item.item_id)} alt={`item ${item.item_id}`} /> : <span className="empty-item" />}
                          <div><strong>{index === 0 ? "첫 구매" : `${index + 1}번째 구매`}</strong><span>{item.time}</span></div>
                        </div>
                      ))}
                    </div>
                  ) : <div className="empty-analysis">아이템 구매 기록이 없습니다.</div>}
                </section>}

                {detailTab === "misc" && <>
                <section id="timeline-analysis" className="detail-panel">
                  <div className="panel-heading"><div><span>TIMELINE</span><h2>경기 타임라인</h2></div><p>주요 이벤트를 시간순으로 확인합니다.</p></div>
                  {renderTimeline()}
                </section>

                <section className="detail-panel data-note-panel">
                  <div><span>DATA</span><h2>데이터 기반 분석</h2></div>
                  <p>이 페이지의 수치는 Riot Games 경기 데이터와 타임라인 이벤트를 기반으로 계산됩니다. AI 생성 분석은 포함하지 않습니다.</p>
                </section>
                </>}
              </>
            )}

            {error && (
              <div className="detail-error-card">
                <div>
                  <span className="error-kicker">REQUEST ERROR</span>
                  <strong>{error}</strong>
                  <p>상세 경기 데이터를 다시 요청해보세요. 서버가 실행 중이고 Riot API 키가 유효한지도 확인해주세요.</p>
                </div>
                <button onClick={retryMatch} disabled={analysisLoading}>다시 불러오기</button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
