export interface Song {
  id: string;
  title: string;
  image: any;
  file: any;
}

export interface Artist {
  id: string;
  name: string;
  image: any;
  songs: Song[];
}

const artists: Artist[] = [
  {
    id: "1",
    name: "Eric Clapton",
    image: require("../assets/images/eric_clapton.jpg"),
    songs: [
      {
        id: "1",
        title: "Tears in Heaven",
        image: require("../assets/images/tears_in_heaven.png"),
        file: require("../assets/music/tears_in_heaven.mp3"),
      },
      {
        id: "2",
        title: "Circus Left Town",
        image: require("../assets/images/circus_left_town.jpg"),
        file: require("../assets/music/circus_left_town.mp3"),
      },
      {
        id: "3",
        title: "My Father’s Eyes",
        image: require("../assets/images/my_fathers_eyes.webp"),
        file: require("../assets/music/my_fathers_eyes.mp3"),
      },
    ],
  },
  {
    id: "2",
    name: "Adele Adkins",
    image: require("../assets/images/adele_adkins.jpg"),
    songs: [
      {
        id: "1",
        title: "Someone Like You",
        image: require("../assets/images/someone_like_you.jpg"),
        file: require("../assets/music/someone_like_you.mp3"),
      },
      {
        id: "2",
        title: "Hello",
        image: require("../assets/images/hello.png"),
        file: require("../assets/music/hello.mp3"),
      },
      {
        id: "3",
        title: "All I Ask",
        image: require("../assets/images/all_i_ask.webp"),
        file: require("../assets/music/all_i_ask.mp3"),
      },
    ],
  },
  {
    id: "3",
    name: "Nine Inch Nails",
    image: require("../assets/images/nine_inch_nails.webp"),
    songs: [
      {
        id: "1",
        title: "Hurt",
        image: require("../assets/images/hurt.jpg"),
        file: require("../assets/music/hurt.mp3"),
      },
      {
        id: "2",
        title: "Something I Can Never Have",
        image: require("../assets/images/something_i_can_never_have.jpg"),
        file: require("../assets/music/something_i_can_never_have.mp3"),
      },
    ],
  },
  {
    id: "4",
    name: "Lord Huron",
    image: require("../assets/images/lord_huron.jpg"),
    songs: [
      {
        id: "1",
        title: "The Night We Met",
        image: require("../assets/images/the_night_we_met.jpg"),
        file: require("../assets/music/the_night_we_met.mp3"),
      },
    ],
  },
  {
    id: "5",
    name: "R.E.M.",
    image: require("../assets/images/r.e.m.jpeg"),
    songs: [
      {
        id: "1",
        title: "Everybody Hurts",
        image: require("../assets/images/everybody_hurts.jpg"),
        file: require("../assets/music/everybody_hurts.mp3"),
      },
      {
        id: "2",
        title: "Nightswimming",
        image: require("../assets/images/nightswimming.jpg"),
        file: require("../assets/music/nightswimming.mp3"),
      },
    ],
  },
  {
    id: "6",
    name: "The Beatles",
    image: require("../assets/images/the_beatles.jpg"),
    songs: [
      {
        id: "1",
        title: "Yesterday",
        image: require("../assets/images/yesterday.jpg"),
        file: require("../assets/music/yesterday.mp3"),
      },
      {
        id: "2",
        title: "Eleanor Rigby",
        image: require("../assets/images/eleanor_rigby.jpg"),
        file: require("../assets/music/eleanor_rigby.mp3"),
      },
    ],
  },
  {
    id: "7",
    name: "Bon Iver",
    image: require("../assets/images/bon_iver.jpg"),
    songs: [
      {
        id: "1",
        title: "Skinny Love",
        image: require("../assets/images/skinny_love.jpg"),
        file: require("../assets/music/skinny_love.mp3"),
      },
      {
        id: "2",
        title: "Holocene",
        image: require("../assets/images/holocene.jpg"),
        file: require("../assets/music/holocene.mp3"),
      },
    ],
  },
  {
    id: "8",
    name: "Elton John",
    image: require("../assets/images/elton_john.jpg"),
    songs: [
      {
        id: "1",
        title: "Candle in the Wind",
        image: require("../assets/images/candle_in_the_wind.jpg"),
        file: require("../assets/music/candle_in_the_wind.mp3"),
      },
      {
        id: "2",
        title: "Sorry Seems to Be the Hardest Word",
        image: require("../assets/images/sorry_seems.jpg"),
        file: require("../assets/music/sorry_seems.mp3"),
      },
    ],
  },
  {
    id: "9",
    name: "Pearl Jam",
    image: require("../assets/images/pearl_jam.webp"),
    songs: [
      {
        id: "1",
        title: "Black",
        image: require("../assets/images/black.jpg"),
        file: require("../assets/music/black.mp3"),
      },
      {
        id: "2",
        title: "Last Kiss",
        image: require("../assets/images/last_kiss.jpg"),
        file: require("../assets/music/last_kiss.mp3"),
      },
    ],
  },
  {
    id: "10",
    name: "Simon & Garfunkel",
    image: require("../assets/images/simon_garfunkel.jpg"),
    songs: [
      {
        id: "1",
        title: "The Sound of Silence",
        image: require("../assets/images/sound_of_silence.jpg"),
        file: require("../assets/music/sound_of_silence.mp3"),
      },
      {
        id: "2",
        title: "Bridge Over Troubled Water",
        image: require("../assets/images/bridge_over_troubled_water.jpg"),
        file: require("../assets/music/bridge_over_troubled_water.mp3"),
      },
    ],
  },
];

export default artists;
