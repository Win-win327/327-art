export interface MagicCard {
  id: number;
  slug: string;
  nameZh: string;
  nameEn: string;
  nameJa: string;
  keywordZh: string;
  keywordEn: string;
  keywordJa: string;
  image: string; // URL to processed card front
  quoteZh: string;
  quoteEn: string;
  quoteJa: string;
  descZh: string;
  descEn: string;
  descJa: string;
  affirmationZh: string;
  affirmationEn: string;
  affirmationJa: string;
}

export const MAGIC_CARDS: MagicCard[] = [
  {
    id: 1,
    slug: "beluga",
    nameZh: "白鯨",
    nameEn: "Beluga Whale",
    nameJa: "白鯨",
    keywordZh: "享受 (Enjoyment)",
    keywordEn: "Enjoyment",
    keywordJa: "享受",
    image: "/images/cards/card-01-beluga-rounded.png",
    quoteZh: "放鬆下來，容許生活的美好自然流進你的生命中。如同白鯨徜徉於極光之下，你的快樂就是最高頻率的顯化力量。",
    quoteEn: "Relax and allow the beauty of life to flow naturally into you. Like a beluga basking beneath the aurora, your pure joy is the highest manifestation frequency.",
    quoteJa: "肩の力を抜いて、人生の美しさをそのまま受け入れてください。オーロラの下を泳ぐ白鯨のように、あなたの純粋な喜びこそが最大の引き寄せの力です。",
    descZh: "白鯨帶著純白無瑕的溫柔與喜悅游入你的生命。牠提醒你，不需要每一刻都活得如此緊繃，生活的本質是一場體驗與享受。放下過度的控制與焦慮，像孩童般純粹地去品味當下的微風、陽光與呼吸。當你處於享受的頻率時，奇蹟就會不請自來。",
    descEn: "The Beluga glides into your consciousness with pure innocence and radiant joy. It gently reminds you that life is meant to be tasted, not merely endured. Release excessive anxiety and control; embrace the breeze, sunlight, and every breath with childlike wonder.",
    descJa: "白鯨は純白の無垢と穏やかな喜びを携えて、あなたの元へ訪れました。人生は必死に耐えるものではなく、味わい楽しむものです。過度な執着を手放し、童心に帰って今この瞬間を満喫してください。",
    affirmationZh: "「我允許自己放鬆，在每個當下全然享受生命的奇蹟與喜悅。」",
    affirmationEn: "“I grant myself permission to relax and wholeheartedly enjoy the miracle of life in every present moment.”",
    affirmationJa: "「私は自分を緩め、今この瞬間を心から楽しむことを自分に許可します。」"
  },
  {
    id: 2,
    slug: "phoenix",
    nameZh: "鳳凰",
    nameEn: "Phoenix",
    nameJa: "鳳凰",
    keywordZh: "再生 (Rebirth)",
    keywordEn: "Rebirth",
    keywordJa: "再生",
    image: "https://i.ibb.co/MyKzGnTB/card-01.jpg",
    quoteZh: "每一次的瓦解，都是神聖新生的序曲。在極光的烈焰中，你將蛻變為更耀眼的自己。",
    quoteEn: "Every dissolution is merely the sacred prelude to rebirth. Through the celestial flames of the aurora, you ascend into a more radiant form.",
    quoteJa: "崩壊に見える出来事は、聖なる再生へのプロローグです。オーロラの炎をくぐり抜け、あなたはより輝く自分へと生まれ変わります。",
    descZh: "鳳凰象徵著跨越深淵後無可匹敵的生命力。過去的挫折、結束或失落並不是終點，而是為更偉大的新生騰出空間。相信你體內的火焰，放下舊有的框架與沉重包袱，你即將在萬丈光芒中展翅高飛。",
    descEn: "The Phoenix embodies invincible vitality born through profound transformation. What has ended was simply clearing room for a grander chapter. Trust the divine flame within your spirit.",
    descJa: "鳳凰は、深い変容の末に目覚める無敵の生命力を象徴しています。過去の喪失は終わりではなく、新たな輝きを迎えるための準備です。胸に宿る神聖な炎を信じてください。",
    affirmationZh: "「我欣然擁抱蛻變，在每一次轉折中釋放力量、昂首重生。」",
    affirmationEn: "“I joyfully embrace change, releasing raw strength and rising reborn through every transition.”",
    affirmationJa: "「私はあらゆる変化を歓びとともに受け入れ、より強く美しく羽ばたきます。」"
  },
  {
    id: 3,
    slug: "dog",
    nameZh: "狗狗",
    nameEn: "Loyal Dog",
    nameJa: "愛犬",
    keywordZh: "當下 (The Present)",
    keywordEn: "The Present",
    keywordJa: "今ここ",
    image: "https://i.ibb.co/tMwHqtdP/card-02.jpg",
    quoteZh: "無條件的忠誠與陪伴，始於對自己的接納。把注意力收回此刻，最珍貴的奇蹟就在這裡。",
    quoteEn: "Unconditional loyalty and presence begin with self-acceptance. Draw your awareness back to now; the ultimate wonder is right here.",
    quoteJa: "無条件の愛と忠誠は、まず自分自身を受け入れることから始まります。意識を今この瞬間に戻せば、奇跡は常にここにあります。",
    descZh: "狗狗象徵著忠誠、陪伴與對此時此刻的全心投入。牠不擔憂明天，也不悔恨昨日，只是單純地愛著眼前的一切。這張卡片邀請你停下奔波的腳步，抱抱自己，真誠地感受身邊的陪伴與愛。",
    descEn: "The loyal dog represents unwavering companionship and pure immersion in the present moment. Release worries of tomorrow and sorrows of yesterday; immerse in authentic love right now.",
    descJa: "愛犬は揺るぎない絆と、「今」に生きる純粋な心を象徴しています。明日の不安を手放し、目の前にある温かな愛に心を開いてください。",
    affirmationZh: "「我全心活在當下，對自己保持最溫柔無條件的陪伴與愛。」",
    affirmationEn: "“I live fully in the present, offering myself gentle, unconditional love and companionship.”",
    affirmationJa: "「私は今この瞬間に生き、自分自身に温かな愛を注ぎます。」"
  },
  {
    id: 4,
    slug: "white-lion-elf",
    nameZh: "白獅與人與精靈",
    nameEn: "White Lion & Elf",
    nameJa: "白獅子と精霊",
    keywordZh: "平靜 (Serenity)",
    keywordEn: "Serenity",
    keywordJa: "静寂",
    image: "https://i.ibb.co/wFbbYXNN/card-03.jpg",
    quoteZh: "在最崇高的威嚴中，蘊含著最深邃的寧靜。心平靜如水，宇宙的智慧便映照其中。",
    quoteEn: "Within the highest majesty lies the deepest stillness. When the heart rests like calm water, universal wisdom reflects perfectly.",
    quoteJa: "気高き尊厳の奥底には、静寂の海が広がっています。心が凪のように穏やかであるとき、宇宙の英知が映し出されます。",
    descZh: "白獅身邊常駐精靈，象徵著強大力量與純淨溫柔的和諧共存。真正的平靜不是沒有狂風暴雨，而是在風暴中央依舊安然如山。回歸你靈魂的中心，安住於這份不可動搖的平靜之中。",
    descEn: "The harmony of the White Lion and the mystical elf represents power anchored in gentle purity. True peace is resting firmly at the eye of life’s whirlwind.",
    descJa: "白獅子と精霊の共鳴は、圧倒的な力と純粋な優しさの調和を表します。心の中心にある不動の静寂へと立ち返りましょう。",
    affirmationZh: "「我的內心如深海般平靜安詳，任何波瀾都無法擾亂我靈魂的清澈。」",
    affirmationEn: "“My heart remains serene like the deep ocean; no storm can perturb the clarity of my soul.”",
    affirmationJa: "「私の内側は静寂に満ちており、どんな波も私の清らかさを曇らせることはできません。」"
  },
  {
    id: 7,
    slug: "aurora-whale",
    nameZh: "極光鯨魚",
    nameEn: "Aurora Whale",
    nameJa: "オーロラ鯨",
    keywordZh: "幸運 (Fortune)",
    keywordEn: "Fortune",
    keywordJa: "幸運",
    image: "https://i.ibb.co/ds4gm9V1/card-04.jpg",
    quoteZh: "宇宙的豐盛正穿透深海的寂靜而來。信任那份宏大的流動，你早已被幸運的光芒籠罩。",
    quoteEn: "Cosmic abundance travels through the ocean depths straight to you. Trust the grand current; fortune has already wrapped you in light.",
    quoteJa: "宇宙の豊かな恩恵が、深海の静寂を越えて届いています。大いなる流れを信頼してください。あなたは既に幸運に包まれています。",
    descZh: "極光鯨魚是遠古智慧與浩瀚幸運的使者。牠在深藍的大海與燦爛的星期間游弋，象徵著巨大的資源、良機與神聖同步性正在向你靠近。張開你的雙臂，欣然接受即將到來的祝福與禮物。",
    descEn: "The Aurora Whale is an emissary of ancient wisdom and boundless fortune. Divine synchronicities and unexpected blessings are gravitating toward your reality.",
    descJa: "オーロラ鯨は太古の叡智と無限の幸運を運ぶ使者です。大きな好機とシンクロニシティが、あなたに引き寄せられています。",
    affirmationZh: "「我信任宇宙的慷慨與安排，幸運與奇蹟如潮水般豐盛流向我。」",
    affirmationEn: "“I trust cosmic generosity; fortune and miraculous synchronicity flow into my life abundantly.”",
    affirmationJa: "「私は宇宙の恩恵を信じ、幸運と奇跡を歓びとともに受け取ります。」"
  },
  {
    id: 14,
    slug: "wild-horses",
    nameZh: "馬群",
    nameEn: "Wild Horses",
    nameJa: "野生馬",
    keywordZh: "行動 (Action)",
    keywordEn: "Action",
    keywordJa: "行動",
    image: "https://i.ibb.co/k2N4XPQM/card-05.jpg",
    quoteZh: "收起所有猶豫，奔馳的時刻已經到來。把心中所想化為步伐，大地將在你的足下共振！",
    quoteEn: "Cast aside hesitation; the hour to gallop has arrived. Translate your vision into swift steps, and the earth will resonate with your stride!",
    quoteJa: "迷いを捨て、大地を駆け抜ける時が来ました。胸に秘めた想いを一歩へと変えれば、道は自然と拓かれます！",
    descZh: "群馬奔騰，帶著破曉的熱忱與不可遏止的動力。這張牌卡告訴你，現在不要再過度分析或拖延，行動是打破停滯的唯一鑰匙。只要你邁出第一步，勢不可擋的推動力就會隨之而來！",
    descEn: "Wild horses gallop with unstoppable passion and momentum. Stop overthinking; decisive action is the master key to dissolve inertia. Take that leap forward!",
    descJa: "疾走する野生馬は、情熱と力強い前進を促しています。計画を頭の中でこね回すのはやめ、勇気ある最初の一歩を踏み出してください。",
    affirmationZh: "「我充滿熱情與動力，毫無畏懼地朝著我的夢想大步前進！」",
    affirmationEn: "“I am filled with vibrant momentum, fearlessly stepping toward the fulfillment of my aspirations!”",
    affirmationJa: "「私は情熱と活力に満ち溢れ、迷わず自分の夢に向かって力強く進みます！」"
  },
  {
    id: 16,
    slug: "pegasus",
    nameZh: "天馬",
    nameEn: "Pegasus",
    nameJa: "天馬",
    keywordZh: "自由 (Freedom)",
    keywordEn: "Freedom",
    keywordJa: "自由",
    image: "https://i.ibb.co/qFr2Tdqr/card-06.jpg",
    quoteZh: "任何圍欄都困不住展翅的靈魂。向上望，天空就是你馳騁的舞台。",
    quoteEn: "No fence can contain a winged spirit. Lift your eyes upward; the sky itself is your limitless realm.",
    quoteJa: "どんな柵も、翼を持つ魂を閉じ込めることはできません。空を見上げてください。無限の自由が広がっています。",
    descZh: "天馬帶著金色的羽翼降臨，象徵打破慣性思維與空間拘束的終極自由。你是否無意中給自己設限了？這張牌呼喚你卸下心智的枷鎖，相信自己能飛躍一切難關，到達前所未見的遼闊境界。",
    descEn: "Pegasus unfurls golden wings, liberating you from self-imposed limitations and societal molds. Believe in your transcendence and soar beyond perceived obstacles.",
    descJa: "天馬は金色の翼を広げ、既成概念や限界を超えた絶対的な自由を象徴します。心の重荷を解き放ち、大空へと羽ばたきましょう。",
    affirmationZh: "「我是自由自在的靈魂，我擁有跨越一切界限、飛躍夢想的力量。」",
    affirmationEn: "“I am an unconstrained soul, gifted with the power to soar beyond all boundaries.”",
    affirmationJa: "「私は自由な魂であり、あらゆる限界を軽やかに超えて夢を叶えます。」"
  },
  {
    id: 17,
    slug: "unicorn",
    nameZh: "獨角獸",
    nameEn: "Unicorn",
    nameJa: "ユニコーン",
    keywordZh: "自信 (Confidence)",
    keywordEn: "Confidence",
    keywordJa: "自信",
    image: "https://i.ibb.co/tTJPKvDB/card-07.jpg",
    quoteZh: "你的獨特性，就是你最強大的光芒。毋須迎合世界，站穩你純淨耀眼的真理。",
    quoteEn: "Your pure uniqueness is your greatest brilliance. You need not conform; stand luminous in your authentic truth.",
    quoteJa: "あなたの唯一無二の個性こそが、最も強い光です。周囲に合わせる必要はありません。誇り高く輝いてください。",
    descZh: "獨角獸額頭的螺旋金角直通宇宙神聖智慧。牠提醒你，不需要試圖讓所有人都理解你，也不要縮小自己的光芒去迎合平庸。深呼吸，認可你一路走來的累積，在世界面前全然展現自信與純真。",
    descEn: "The Unicorn’s spiral horn channels celestial light and pure self-worth. Do not shrink to fit modest spaces; step boldly into the splendor of who you truly are.",
    descJa: "ユニコーンの角は、高次の直感と揺るぎない自己価値を宿しています。自分を小さく見せるのはやめ、ありのままのあなたを堂々と表現してください。",
    affirmationZh: "「我深知自己的珍貴與獨一無二，我充滿力量、自信綻放。」",
    affirmationEn: "“I recognize my sacred worth and unique brilliance; I stand radiant and confident.”",
    affirmationJa: "「私は自らの尊さと輝きを認め、自信を持って光を放ちます。」"
  },
  {
    id: 24,
    slug: "aurora-white-lion",
    nameZh: "極光白獅",
    nameEn: "Aurora White Lion",
    nameJa: "オーロラ白獅子",
    keywordZh: "堅定 (Resolve)",
    keywordEn: "Resolve",
    keywordJa: "不動",
    image: "https://i.ibb.co/MyKzGnTB/card-01.jpg",
    quoteZh: "王者之光，深植於無畏的信念之中。穩穩紮根，你就是奇蹟的守護者。",
    quoteEn: "The sovereign light is rooted in fearless conviction. Stand unwavering; you are the guardian of miracles.",
    quoteJa: "王者の輝きは、揺るぎない信念の中に宿ります。しっかりと大地に立ち、奇跡を守護してください。",
    descZh: "極光白獅是 327 ART 最核心的守護神獸。半面金光、半面深邃，象徵光明與陰影的完整合一。當你抽中這張牌，代表你的靈魂正在經歷一場重要考驗，而你已經具備無比強大的韌性與決心，必將凱旋。",
    descEn: "The Aurora White Lion stands at the core of 327 ART. Radiating golden authority and serene mystery, it assures you that your resolve will conquer any challenge.",
    descJa: "オーロラ白獅子は、光と闇を統合した最高位の守護獣です。あなたの胸の奥深くには、どんな試練も乗り越える不滅の信念が燃えています。",
    affirmationZh: "「我擁有如同雄獅般堅定不可撼動的意志，我無所畏懼、昂首前行。」",
    affirmationEn: "“I possess the steadfast, majestic resolve of the lion; I walk forward with unwavering sovereignty.”",
    affirmationJa: "「私は獅子のように不動の意志を持ち、何ものにも恐れず誇り高く歩みます。」"
  }
];
