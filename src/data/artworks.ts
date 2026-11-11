export interface Artwork {
  id: string;
  title: string;
  img: string;
  year: string;
  size: string;
  media: string;
  desc?: string;
  sold?: boolean;
  group: "aurora" | "splash" | "taiwan-endemic";
}

export const artworks: Artwork[] = [
  // 極光系列
  {
    id: "lion-king",
    title: "獅王",
    img: "/images/home-art1.jpg",
    year: "2020",
    size: "45.5x53cm",
    media: "油畫 Oil on Canvas",
    desc: "「在對立中誕生，在合一中稱王。」",
    group: "aurora"
  },
  {
    id: "luky-whale",
    title: "幸運",
    img: "https://i.ibb.co/Z1T1v6n2/port-aurora-02.jpg",
    year: "2020",
    size: "33x45.5cm",
    media: "油畫 Oil on Canvas",
    desc: "「幸運！我生來如此！」",
    group: "aurora"
  },
  {
    id: "aurora-dolphin",
    title: "極光海豚",
    img: "/images/home-art2.jpg",
    year: "2019",
    size: "31.5x41cm",
    media: "油畫 Oil on Canvas",
    desc: "「你只會在我的眼神中，看出一個答案。」",
    group: "aurora"
  },
  {
    id: "black-panther",
    title: "幻象 黑豹",
    img: "https://i.ibb.co/Pngxt4W/port-aurora-04.jpg",
    year: "2020",
    size: "50x60cm",
    media: "油畫 Oil on Canvas",
    desc: "「當光與影合一，我成為真正的王。」",
    group: "aurora"
  },
  {
    id: "calm-white-lion",
    title: "平靜 白獅",
    img: "https://i.ibb.co/pBx6NGYN/port-aurora-05.jpg",
    year: "2021",
    size: "53x45.5cm",
    media: "油畫 Oil on Canvas",
    desc: "「平靜，我已在對的位置。」",
    group: "aurora"
  },
  {
    id: "chief-phoenix",
    title: "酋長鳳凰",
    img: "https://i.ibb.co/sdt0XNWk/port-aurora-06.jpg",
    year: "2024",
    size: "53x65cm",
    media: "油畫 Oil on Canvas",
    desc: "「這不是羽翼，而是命運的形狀。」",
    group: "aurora"
  },
  {
    id: "colorful-bigcat",
    title: "彩之光 大貓",
    img: "https://i.ibb.co/cc5Rk8Qf/port-aurora-07.jpg",
    year: "2024",
    size: "50x60.5cm",
    media: "油畫 Oil on Canvas",
    desc: "「彩之光，就是我靈魂的樣貌。」",
    group: "aurora"
  },
  {
    id: "aurora-phoenix",
    title: "極光鳳凰",
    img: "https://i.ibb.co/KjBDpL5B/port-aurora-08.jpg",
    year: "2024",
    size: "50x60cm",
    media: "油畫 Oil on Canvas",
    desc: "「我從烈焰而來，覺醒出真正的我。」",
    group: "aurora"
  },
  {
    id: "co-dog",
    title: "可多",
    img: "https://i.ibb.co/XxyMy1C5/port-aurora-09.jpg",
    year: "2022",
    size: "60.5x50cm",
    media: "油畫 Oil on Canvas",
    desc: "「愛你的眼神。」",
    group: "aurora"
  },
  {
    id: "dance-white-whale",
    title: "舞動白鯨",
    img: "https://i.ibb.co/5xF9Qn0Y/port-aurora-010.jpg",
    year: "2021",
    size: "31.5x41cm",
    media: "油畫 Oil on Canvas",
    desc: "「來跟宇宙之光跳舞吧！」",
    group: "aurora"
  },
  {
    id: "tiger-cat",
    title: "鏡",
    img: "https://i.ibb.co/601nCMjh/port-aurora-011.jpg",
    year: "2021",
    size: "31x41cm",
    media: "油畫 Oil on Canvas",
    desc: "「你看到的，是你自己。」",
    group: "aurora"
  },
  {
    id: "aurora-dragon",
    title: "極光舞龍",
    img: "https://i.ibb.co/XrhPwhLN/port-aurora-012.jpg",
    year: "2024",
    size: "45.5x60.5cm",
    media: "油畫 Oil on Canvas",
    desc: "「世界隨著我舞動。」",
    group: "aurora"
  },
  {
    id: "aurora-owl-sight",
    title: "貓頭鷹的對視",
    img: "https://i.ibb.co/0Rmt8xhy/port-aurora-013.jpg",
    year: "2020",
    size: "53x45.5cm",
    media: "油畫 Oil on Canvas",
    desc: "「對視裡，我只看見合一。」",
    group: "aurora"
  },
  {
    id: "wolf-howl",
    title: "狼 喚醒",
    img: "https://i.ibb.co/TBVFPXMH/port-aurora-014.jpg",
    year: "2022",
    size: "40.5x53cm",
    media: "油畫 Oil on Canvas",
    desc: "「喚醒你內在的力量。」",
    group: "aurora"
  },
  {
    id: "aurora-water-dragon",
    title: "極光海龍",
    img: "https://i.ibb.co/5xgHRjgp/port-aurora-015.jpg",
    year: "2021",
    size: "45.5x53cm",
    media: "油畫 Oil on Canvas",
    desc: "「我能從我的手中顯化一切。」",
    group: "aurora"
  },
  {
    id: "lover-birds",
    title: "愛",
    img: "https://i.ibb.co/YB7r5GQc/port-aurora-016.jpg",
    year: "2022",
    size: "50x60cm",
    media: "油畫 Oil on Canvas",
    desc: "「愛，是我們與生俱來的能力。」",
    group: "aurora"
  },
  {
    id: "elephant-protect",
    title: "守護 象神",
    img: "https://i.ibb.co/zphDs8w/port-aurora-017.jpg",
    year: "2022",
    size: "53x65cm",
    media: "油畫 Oil on Canvas",
    desc: "「我會永遠在你面前守護你。」",
    group: "aurora"
  },
  {
    id: "freedom-horses",
    title: "天馬",
    img: "https://i.ibb.co/nqVnxmct/port-aurora-018.jpg",
    year: "2022",
    size: "未提尺寸規格",
    media: "油畫 Oil on Canvas",
    desc: "「當你相信自己，翅膀就張開了。」",
    sold: true,
    group: "aurora"
  },
  {
    id: "warrior-deer",
    title: "勇者鹿",
    img: "https://i.ibb.co/B5pJtF9d/port-aurora-019.jpg",
    year: "2020",
    size: "50x50cm",
    media: "油畫 Oil on Canvas",
    desc: "「勇者，永遠以愛去幻化一切。」",
    group: "aurora"
  },
  {
    id: "colorful-lionking",
    title: "唯我獨尊",
    img: "https://i.ibb.co/Q75tYqxb/port-aurora-020.jpg",
    year: "2025",
    size: "60.5x72.5cm",
    media: "油畫 Oil on Canvas",
    desc: "「天獅展翅，唯我獨尊。」",
    group: "aurora"
  },
  {
    id: "whale-eye",
    title: "鯨 之 眼",
    img: "https://i.ibb.co/mrV6MsRc/port-aurora-021.jpg",
    year: "2021",
    size: "未提尺寸規格",
    media: "油畫 Oil on Canvas",
    desc: "「所有力量，從這個焦點開始。」",
    sold: true,
    group: "aurora"
  },
  {
    id: "new-earth",
    title: "新地球",
    img: "https://i.ibb.co/5hJGrkD0/port-aurora-022.jpg",
    year: "2022",
    size: "45.5x53cm",
    media: "油畫 Oil on Canvas",
    desc: "「你知道永遠都有一顆全新的地球等著你嗎？」",
    group: "aurora"
  },
  {
    id: "phoenix",
    title: "浴火鳳凰",
    img: "https://i.ibb.co/LzTn4kNT/port-aurora-023.jpg",
    year: "2021",
    size: "未提尺寸規格",
    media: "油畫 Oil on Canvas",
    desc: "「我穿越的每道火焰，就是覺醒的時刻。」",
    sold: true,
    group: "aurora"
  },
  {
    id: "expand-deer-eif",
    title: "擴展",
    img: "https://i.ibb.co/9mG0ktWN/port-aurora-024.jpg",
    year: "2022",
    size: "未提尺寸規格",
    media: "油畫 Oil on Canvas",
    desc: "「相信命運的擴展。」",
    sold: true,
    group: "aurora"
  },
  {
    id: "brave-lion",
    title: "勇氣的力量",
    img: "https://i.ibb.co/HpGkfCfS/port-aurora-025.jpg",
    year: "2024",
    size: "53x65cm",
    media: "油畫 Oil on Canvas",
    desc: "「從我胸口爆發出的力量，就是一尊獅王。」",
    group: "aurora"
  },
  {
    id: "aurora-mouse",
    title: "極光黃金鼠",
    img: "https://i.ibb.co/ksdVVDpD/port-aurora-026.jpg",
    year: "2020",
    size: "53x45cm",
    media: "油畫 Oil on Canvas",
    desc: "「我眼中的世界如此耀眼，但我才是最耀眼的那一個。」",
    group: "aurora"
  },
  {
    id: "aurora-mink",
    title: "豐盛的源頭",
    img: "https://i.ibb.co/jvjrPYzJ/port-aurora-027.jpg",
    year: "2021",
    size: "未提尺寸規格",
    media: "油畫 Oil on Canvas",
    desc: "「我就是豐盛的源頭。」",
    sold: true,
    group: "aurora"
  },
  {
    id: "aurora-lion-mother-hug",
    title: "堅定",
    img: "https://i.ibb.co/wr857Z19/port-aurora-028.jpg",
    year: "2022",
    size: "未提尺寸規格",
    media: "油畫 Oil on Canvas",
    desc: "「堅定的力量可以傳承。」",
    sold: true,
    group: "aurora"
  },

  // 潑彩系列
  {
    id: "cs-fly-uncorni",
    title: "飛越獨角獸",
    img: "https://i.ibb.co/8gSSYtxf/port-splash-01.jpg",
    year: "2025",
    size: "72.5x60.5cm",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「一半真實，一半奇蹟，這就是我存在的目的。」",
    group: "splash"
  },
  {
    id: "cs-dragon-doublebass",
    title: "神 龍 （低音大提琴）",
    img: "https://i.ibb.co/QjdQf6hL/port-splash-02.jpg",
    year: "2025",
    size: "60.5x72.5cm",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「當龍與音樂共舞 ⎯ 我用最深的聲音，喚醒大地。」",
    group: "splash"
  },
  {
    id: "cs-dragon-trombone",
    title: "神 龍 （長號）",
    img: "/images/hero-splash-02.jpg",
    year: "2025",
    size: "60.5x72.5cm",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「當龍與音樂共舞 ⎯ 一口氣，吹醒光。」",
    group: "splash"
  },
  {
    id: "cs-dragon-piano",
    title: "神 龍 （鋼琴）",
    img: "https://i.ibb.co/mC7cmN3G/port-splash-04.jpg",
    year: "2025",
    size: "60.5x72.5cm",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「當龍與音樂共舞 ⎯ 世界因我染上色彩。」",
    group: "splash"
  },
  {
    id: "cs-toucan",
    title: "大嘴鳥",
    img: "https://i.ibb.co/VcmDj0kM/port-splash-05.jpg",
    year: "2023",
    size: "未提尺寸規格",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「我把世界，一口一口看進來。」",
    sold: true,
    group: "splash"
  },
  {
    id: "cs-sea-turtle",
    title: "寶石海龜",
    img: "https://i.ibb.co/DfVtwnMv/port-splash-06.jpg",
    year: "2021",
    size: "45.5x53cm",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「我就是那，在海中遨遊的寶石。」",
    group: "splash"
  },
  {
    id: "cs-dragon-boat-festival",
    title: "端午龍",
    img: "https://i.ibb.co/vgQZVCG/port-splash-07.jpg",
    year: "2025",
    size: "65x53cm",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「這不是傳說，是祝福。」",
    group: "splash"
  },
  {
    id: "cs-cat-fish",
    title: "雙",
    img: "https://i.ibb.co/Qv5NMVVg/port-splash-08.jpg",
    year: "2025",
    size: "65x53cm",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「在彼此的世界裡，有我陪著你。」",
    group: "splash"
  },
  {
    id: "cs-cat-stare",
    title: "貓 の凝視",
    img: "https://i.ibb.co/v4zKn06Y/port-splash-09.jpg",
    year: "2025",
    size: "45.5x33cm",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「盯⎯⎯ 盯⎯⎯ ...」",
    group: "splash"
  },
  {
    id: "cs-elephant",
    title: "潑彩象神",
    img: "https://i.ibb.co/x82CXSZM/port-splash-010.jpg",
    year: "2020",
    size: "50x50cm",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「用色彩說話，This is ME！」",
    group: "splash"
  },
  {
    id: "cs-lion-magic-lamp",
    title: "神 燈 獅",
    img: "https://i.ibb.co/4RYdw98M/port-splash-011.jpg",
    year: "2020",
    size: "38x45cm",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「向我橫刀奪愛吧！由我實現它！」",
    group: "splash"
  },
  {
    id: "cs-owl-teacher",
    title: "智者",
    img: "https://i.ibb.co/R42zg3wJ/port-splash-012.jpg",
    year: "2025",
    size: "65x53cm",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「你要的答案一直都在。」",
    group: "splash"
  },
  // 台灣特有種系列
  {
    id: "tw-leopard-cat",
    title: "石虎",
    img: "https://i.ibb.co/RTL4xntX/2.jpg",
    year: "2026",
    size: "65x53cm",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「生命中的光芒，在大自然『眼』中悄然覺醒。」",
    group: "taiwan-endemic"
  },
  {
    id: "tw-blue-magpie",
    title: "台灣藍鵲",
    img: "https://i.ibb.co/ywy703J/2.jpg",
    year: "2026",
    size: "60.5x72.5cm",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「飛越群山，我披上了這片土地最美的樂章。」",
    group: "taiwan-endemic"
  },
  {
    id: "tw-black-bear",
    title: "台灣黑熊",
    img: "https://i.ibb.co/4Rvs7qJZ/image.jpg",
    year: "2026",
    size: "未提尺寸規格",
    media: "複合媒材 壓克力 油畫 Mix Media, Acrylic & Oil on Canvas",
    desc: "「勇敢張開雙臂，迎接屬於自己的天空。」",
    sold: true,
    group: "taiwan-endemic"
  }
];
