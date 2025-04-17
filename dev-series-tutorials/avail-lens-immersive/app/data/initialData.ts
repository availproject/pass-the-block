// Color palette
export const colors = {
  primary: '#3CA3FC',    // Primary Blue
  secondary: '#58C8F6',  // Light Blue
  tertiary: '#44D5DE',   // Mint
  accent1: '#EDC7FC',    // Purple
  accent2: '#FEC7C7',    // Pink
  edges: '#BCE3FE',      // Light edge color for better visibility
};

// Convert network data to 3D visualization format
export function processNetworkData(networkData: any) {
  const nodes = networkData.nodes.map((node: any, index: number) => ({
    id: node.id,
    label: node.name,
    position: calculateNodePosition(index, networkData.nodes.length),
    color: getNodeColor(node.lensScore),
    followers: node.followers,
    following: node.following,
    picture: node.picture,
    lensScore: node.lensScore,
    posts: node.posts || 0
  }));

  const edges = networkData.links.map((link: any) => ({
    source: link.source,
    target: link.target
  }));

  return { nodes, edges };
}

// Helper function to calculate node positions in 3D space
function calculateNodePosition(index: number, total: number): [number, number, number] {
  const radius = 20;
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  return [
    radius * Math.cos(theta) * Math.sin(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(phi)
  ];
}

// Helper function to determine node color based on Lens score
function getNodeColor(lensScore: number): string {
  if (lensScore > 9990) return colors.primary;
  if (lensScore > 9900) return colors.secondary;
  if (lensScore > 9000) return colors.tertiary;
  if (lensScore > 5000) return colors.accent1;
  return colors.accent2;
}

// Initial network data
export const initialData = {
  "nodes": [
    {
      "id": "0x081b98",
      "name": "lens/avail_project",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/aeec8da87b28eb7d6799129d604862ed5d4267411dc64aa1aa5f13bbbeb088ad.webp",
      "followers": 555,
      "following": 6,
      "lensScore": 9993,
      "posts": 15
    },
    {
      "id": "0x021135",
      "name": "lens/aoifeodwyer",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/f58510e2b576d9753288e6c9f579158b30878734c64715c8c3043718e4f4f6df.webp",
      "followers": 24711,
      "following": 440,
      "lensScore": 9998,
      "posts": 786
    },
    {
      "id": "0xcd80",
      "name": "lens/mp",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/5367d04f77d03359ffd067dcb33fc6b6c4ed93d889223f462367619f26f0eb4f.jpg",
      "followers": 29518,
      "following": 475,
      "lensScore": 9997
    },
    {
      "id": "0x018981",
      "name": "lens/simonj",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/4cdb44d028f9f42f47b62e45371714a02dbc176b8f37e17df3e1bd9a715a660c.jpg",
      "followers": 17068,
      "following": 737,
      "lensScore": 9996
    },
    {
      "id": "0x081593",
      "name": "lens/paulacomesfirst",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/dd01c38fe3a0e5279ed2a19f57b0308070506fecb53b08de7a12d8cfbb282d17.jpg",
      "followers": 1578,
      "following": 42,
      "lensScore": 9996
    },
    {
      "id": "0x25bb",
      "name": "lens/salti",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/59632ec88bb9ee3f6cc78843a11d7638ebe536fb8f8306815459025a59dd13a7.png",
      "followers": 18066,
      "following": 575,
      "lensScore": 9995
    },
    {
      "id": "0x01cbd1",
      "name": "lens/ialberquilla",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/21234d4aece99e27928e6dc8fc4220d6beda78eb526373b7ae108a800b7f37d5.png",
      "followers": 13120,
      "following": 100,
      "lensScore": 9995
    },
    {
      "id": "0x69f9",
      "name": "lens/mycaleum",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/28be841900fb2f41d49e597dc9dc3c7b7ca4567486e5d1db2e7a9d80955d849b.png",
      "followers": 11565,
      "following": 616,
      "lensScore": 9994
    },
    {
      "id": "0x05",
      "name": "lens/stani",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/cf64097acb654ff13e92c48072c0b3973fd66b231521c2149c6aa9c21d6f491f.png",
      "followers": 135121,
      "following": 1295,
      "lensScore": 9994
    },
    {
      "id": "0x5881",
      "name": "lens/nilesh",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/515241a52459c6a381ec13155cd8bbda5859a6d41c9036a2c8c67624a18809e5.jpg",
      "followers": 49227,
      "following": 2279,
      "lensScore": 9994
    },
    {
      "id": "0x0145",
      "name": "lens/nohussle",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/9ab972aa16a68c59e3873c840ba50025f8e1fba48fab7e65eeea1b20fd6632d9.jpg",
      "followers": 33200,
      "following": 384,
      "lensScore": 9993
    },
    {
      "id": "0x01b367",
      "name": "lens/grlkrash",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/c556f22fbdcd06abb76826476b8281e4b72739880a424bb6905f6381edbafbe6.jpg",
      "followers": 7275,
      "following": 78,
      "lensScore": 9998
    },
    {
      "id": "0x04d865",
      "name": "lens/kolin",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/f52b387095338b4d2c5d6522bf27c3f8ef87fd1120c405cd4b63d901874d9ed9.webp",
      "followers": 11719,
      "following": 156,
      "lensScore": 9998
    },
    {
      "id": "0x01c1b6",
      "name": "lens/boogaav",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/11ac85b934dd664bae1715ec2b434619ff0e4458d7d9ea610d78b8a13498609b.webp",
      "followers": 16029,
      "following": 113,
      "lensScore": 9998
    },
    {
      "id": "0x07f960",
      "name": "lens/sarahwords",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/1f368edf35a6a84d6ed5b5bcdcec1830f8795fbee65d36789853c51e124cc0eb.webp",
      "followers": 13605,
      "following": 229,
      "lensScore": 9998
    },
    {
      "id": "0x04bd61",
      "name": "lens/blakefinucane",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/062a6e80b414080580fa7acdcdea35d224049153afef52a123977214d8282b35.jpg",
      "followers": 12901,
      "following": 106,
      "lensScore": 9998
    },
    {
      "id": "0x019a20",
      "name": "lens/elliepritts",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/0f3502489d121b67d9ec0f94791aa9c83f714ec9eb5d9afa5b17c6629a460b6d.png",
      "followers": 26769,
      "following": 71,
      "lensScore": 9998
    },
    {
      "id": "0xce03",
      "name": "lens/lovegreg",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/79e828dad61daf415daa58c8c012edb6ef0d576d4320adaa04787a223ee26d3b.jpg",
      "followers": 28749,
      "following": 143,
      "lensScore": 9998
    },
    {
      "id": "0x01a6",
      "name": "lens/carlosbeltran",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/f3e34040fa57781089c09fa997998279480e962788db883979022151976767b8.jpg",
      "followers": 41657,
      "following": 507,
      "lensScore": 9998
    },
    {
      "id": "0x01eb28",
      "name": "lens/abieyuwa",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/d29742011b826aaf69fd3bc7ababac336270bdc996dcaad3d6d74f98eab62b6b.webp",
      "followers": 17254,
      "following": 52,
      "lensScore": 9998
    },
    {
      "id": "0x019978",
      "name": "lens/charmtaylor",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/a8fd2a18c700c4a2659c41d4c01360ceacdd2714d8c8ac88fc17e7276dbf196c.webp",
      "followers": 19181,
      "following": 170,
      "lensScore": 9998
    },
    {
      "id": "0x01970c",
      "name": "lens/raeisla",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/1c38f0c82897e4cc787de54d73db753743f18785eaa6a4639e32001873a39a3b.webp",
      "followers": 4925,
      "following": 99,
      "lensScore": 9998
    },
    {
      "id": "0x04e8bd",
      "name": "lens/newhere",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/a3657ef6f24117327d7894dc09b1405b9af94c31d820fd13fce7344adebf03dd.webp",
      "followers": 5542,
      "following": 16,
      "lensScore": 9998
    },
    {
      "id": "0x0491ae",
      "name": "lens/xmastimeblindpplseeing",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/372b5fcf8211bac68e32005e3beed6a78abc80fae4bd48ad09a51eff519fd0fc.png",
      "followers": 2461,
      "following": 28,
      "lensScore": 9998
    },
    {
      "id": "0x2057",
      "name": "lens/refraction",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/d0814b3173009418ff49f210ab7894cc613e0536d0eb05b1f5c39f6f73a0883b.jpg",
      "followers": 37036,
      "following": 229,
      "lensScore": 9998
    },
    {
      "id": "0x054fa2",
      "name": "lens/ogunkizmaz",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/252e74292ebdf04fcad116c9f563d1902b4e7826297b288622074f3f28fab86f.webp",
      "followers": 4409,
      "following": 47,
      "lensScore": 9997
    },
    {
      "id": "0x056934",
      "name": "lens/futuradrops",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/b92a848809336f69daff29d09dacab62d97fba0dd85a400375036e47e72ccb87.webp",
      "followers": 4963,
      "following": 72,
      "lensScore": 9997
    },
    {
      "id": "0x01a8ae",
      "name": "lens/lindao",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/abb9190ccf052206a2da6d705d2ff7938ca723bd49029ecdde88f1ec7e703184.jpg",
      "followers": 19330,
      "following": 89,
      "lensScore": 9997
    },
    {
      "id": "0x015ef2",
      "name": "lens/alimo",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/e1b2dd61eee4dbc2bf5e783b7a5486ddc7e933e7f5adc2731d2ff07d1f756eb5.png",
      "followers": 31382,
      "following": 258,
      "lensScore": 9997
    },
    {
      "id": "0x1a12",
      "name": "lens/charlota",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/e2199534c580fb12d3bbba1c32aa535c0ddca4c24674fc81c176b17aa9feb40e.png",
      "followers": 2202,
      "following": 42,
      "lensScore": 9997
    },
    {
      "id": "0x01cae5",
      "name": "lens/darkshadow",
      "picture": "https://gw.ipfs-lens.dev/ipfs/QmQVfnumWHAW37VqbXaC43e693JxZQRZtZXAk27CQMdH4S",
      "followers": 7695,
      "following": 273,
      "lensScore": 9997
    },
    {
      "id": "0x01837b",
      "name": "lens/iamlosi",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/4482f2da284eef189d22a7d99bb142decfd6468ec4a4703275244d9d5d41847a.jpg",
      "followers": 19267,
      "following": 265,
      "lensScore": 9996
    },
    {
      "id": "0x036a7e",
      "name": "lens/mareksokol",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/ebbd340c8eb38919d09f137ee5d5de6a02e5e7375249c998b403fcae69106580.jpg",
      "followers": 3197,
      "following": 140,
      "lensScore": 9996
    },
    {
      "id": "0x05d393",
      "name": "lens/oswaldotorres",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/ad9d08b1083664cc2b1425f555707a63c197bd922dd7bf5b6162abe8445829d4.jpg",
      "followers": 7478,
      "following": 592,
      "lensScore": 9996
    },
    {
      "id": "0x01a698",
      "name": "lens/jamesbeck",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/b58c486e7e07a16d6eb917d8da5b510f95a03ed43cd741f41a6d7376e2e95476.jpg",
      "followers": 20854,
      "following": 440,
      "lensScore": 9996
    },
    {
      "id": "0x018df6",
      "name": "lens/frankiestyles",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/9694da05d9ebf67584acfd44d99e15e48e19432adc7634ca22b454e52da79cff.jpg",
      "followers": 31130,
      "following": 197,
      "lensScore": 9995
    },
    {
      "id": "0x8e",
      "name": "lens/christina",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/1d575dc64321b54eb5803b538c142386d2ec968f0c0ee47e4dbe901ced7917bf.png",
      "followers": 89206,
      "following": 1476,
      "lensScore": 9995
    },
    {
      "id": "0x083688",
      "name": "lens/sabrinadegas",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/b9c22fd6a8e32d14b150f5f0f064aa85693ee1788c148a66fa6899c0ce2d385e.jpg",
      "followers": 4281,
      "following": 150,
      "lensScore": 9995
    },
    {
      "id": "0x01b000",
      "name": "lens/fireflyapp",
      "picture": "https://media.firefly.land/lens/5a9fb9d0-4378-4c11-931c-051109fc97ad.png",
      "followers": 5171,
      "following": 32,
      "lensScore": 9997
    },
    {
      "id": "0x019f4f",
      "name": "lens/carlathepoet",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/662944ce7a92255de3af6acea1bfb8d99933663c660f20fbcec8379ace927e06.jpg",
      "followers": 5588,
      "following": 63,
      "lensScore": 9997
    },
    {
      "id": "0x01d70e",
      "name": "lens/rileybeans",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/81d55a5fa4d5b7800027442a3186970b3e48f9b689225a1431938de1db3c174d.jpg",
      "followers": 19915,
      "following": 128,
      "lensScore": 9997
    },
    {
      "id": "0x01c4a6",
      "name": "lens/auradeluxe",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/c36a1276db8b36b3544b815c1bc72552231aa16723cb25e87a1cf75fd216c171.png",
      "followers": 4259,
      "following": 77,
      "lensScore": 9997
    },
    {
      "id": "0xb427",
      "name": "lens/tomasmika",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/8024d8bc3e32c95e6bdf1659efa08112e6ac805126e1148444573b84bef32c94.jpg",
      "followers": 7892,
      "following": 314,
      "lensScore": 9997
    },
    {
      "id": "0x01a14e",
      "name": "lens/definn",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/4dfd4b2ddde61393610b1df1d6910dc6bf9fe28cf542a42606a1dc0ac0f3d69a.png",
      "followers": 35828,
      "following": 386,
      "lensScore": 9997
    },
    {
      "id": "0xd8",
      "name": "lens/paulburke",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/b88af82005b8b8ef8f03f766bb15c33be5863ff9fdd59d7de7677e4ce193172d.png",
      "followers": 36672,
      "following": 171,
      "lensScore": 9996
    },
    {
      "id": "0x022ccf",
      "name": "lens/sealaunch",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/30a7cafd5b944a816e4245bc200b0231ccc074bbb64b536f811ecf8695b1c763.webp",
      "followers": 22289,
      "following": 317,
      "lensScore": 9996
    },
    {
      "id": "0x0210",
      "name": "lens/paris",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/a9e7764d4d0bf5c2bf8b0f79958e6b001f9b152bbaecabc5e60de8b9bf655d98.png",
      "followers": 66341,
      "following": 559,
      "lensScore": 9996
    },
    {
      "id": "0x01af07",
      "name": "lens/papajams",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/cdd044eb394734cc4c8fe7d304111e6413da2f00f5f9ec4be8e573c06c8d0181.png",
      "followers": 12419,
      "following": 822,
      "lensScore": 9996
    },
    {
      "id": "0x01632e",
      "name": "lens/0xkoh",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/846e4f7ca493ed1415debd07b600102810f6a95147bb532f24783147094fc967.png",
      "followers": 4557,
      "following": 477,
      "lensScore": 9996
    },
    {
      "id": "0xa68c",
      "name": "lens/juampi",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/dd0ca8d79348da6782af8ff1c818297a33d8de0bc5789762fa1f0f403336caf2.png",
      "followers": 30042,
      "following": 349,
      "lensScore": 9996
    },
    {
      "id": "0x01d8d5",
      "name": "lens/trustmebro",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/8c3056a2f6fd9e31f5d8c46b456c2a17d7347743b521e700d38b8415a181503c.png",
      "followers": 15559,
      "following": 270,
      "lensScore": 9995
    },
    {
      "id": "0x019962",
      "name": "lens/dominosmusic",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/de1a8e3188efec10f9766f19d5e00b3960eb1e9265362ce03b9ca66e272e6f36.png",
      "followers": 6852,
      "following": 102,
      "lensScore": 9997
    },
    {
      "id": "0x019c14",
      "name": "lens/mstrbstrd",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/0bffcbe63a75e8baab42ffb63744f9b56dcc001f9442f6237c6e42b96c711f7e.jpg",
      "followers": 30423,
      "following": 196,
      "lensScore": 9997
    },
    {
      "id": "0x01e397",
      "name": "lens/mushroomprotocol",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/617a9de4f0488ef53e42529805dd2e5a630275de4995e442d629404abf8550a3.png",
      "followers": 2469,
      "following": 112,
      "lensScore": 9997
    },
    {
      "id": "0x66c3",
      "name": "lens/thumbsup",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/b5079a7a2df2fdd34d29f5593877f87bd50e352ac165993821638a85f4e20dea.png",
      "followers": 7635,
      "following": 193,
      "lensScore": 9997
    },
    {
      "id": "0xac6a",
      "name": "lens/gmifrens",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/2eed6d9d195a9dc31c3643493d21cb53edf437f90b45452ffdec1acaca0cce65.png",
      "followers": 1256,
      "following": 60,
      "lensScore": 9997
    },
    {
      "id": "0x01afc5",
      "name": "lens/rac",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/de1c72c15dfadc562b3f800b9e1887d6ecdba8050e69fa09a5377bc7d675ee4a.png",
      "followers": 24172,
      "following": 9,
      "lensScore": 9998
    },
    {
      "id": "0x01d1af",
      "name": "lens/fwb",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/1a954c854462360b97e57504b2799e84a14ce35ae0d20d60cab40ee6160e1850.png",
      "followers": 21436,
      "following": 45,
      "lensScore": 9998
    },
    {
      "id": "0x01d0f0",
      "name": "lens/cheryldouglass",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/8901b2d5c01e3ce4da235f121dcf26c292a79564ee4c1549c97784465981ff95.jpg",
      "followers": 16174,
      "following": 114,
      "lensScore": 9997
    },
    {
      "id": "0x1087",
      "name": "lens/cristinaspinei",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/8c749ee9a1b09b9c0c54c55512f56b793645b9ea33128bd30de33f7fa8c3e6c8.jpg",
      "followers": 33561,
      "following": 519,
      "lensScore": 9996
    },
    {
      "id": "0x0164b5",
      "name": "lens/alexpaul",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/0d84c061bc8ce24953f22c9ff4c57019934858290393b15121abf852814e1eac.webp",
      "followers": 9426,
      "following": 1274,
      "lensScore": 9996
    },
    {
      "id": "0x01d6da",
      "name": "lens/visualartist",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/eae82bb3a177216cfad3a7e072cb3f8df55ec6c674ae4d8caf924f7c3fd2f2fc.jpg",
      "followers": 6852,
      "following": 126,
      "lensScore": 9996
    },
    {
      "id": "0x01c173",
      "name": "lens/pancakesbrah",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/ae7c916d7cbd75c58c22607a19736dedd8ae1565cda63ce4658362f2f3173d82.jpg",
      "followers": 17900,
      "following": 413,
      "lensScore": 9996
    },
    {
      "id": "0x01c5ff",
      "name": "lens/violettazironi",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/0cee44851c38d485a9deee373397772787e2e9a1f5a2d186af594d3f543f3488.jpg",
      "followers": 17007,
      "following": 201,
      "lensScore": 9996
    },
    {
      "id": "0x01a041",
      "name": "lens/aaronrferguson",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/52a08bb0f7e8a29240399088d03d82a7182bbf70dad5a848656767ad6579dc60.webp",
      "followers": 15098,
      "following": 94,
      "lensScore": 9996
    },
    {
      "id": "0x0e76",
      "name": "lens/natem",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/f00de356b176b386fe0848188470a1c8bc7fd8cbe593ef03236bc546c7bdafe6.png",
      "followers": 28829,
      "following": 519,
      "lensScore": 9997
    },
    {
      "id": "0x6388",
      "name": "lens/emilyoffline",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/21fe398cdb6b29235403505362a68447c75ef43df4915dac613c5b7522f07c9d.png",
      "followers": 19024,
      "following": 209,
      "lensScore": 9997
    },
    {
      "id": "0x04c480",
      "name": "lens/nessytherilla",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/dd7f4b24a8f4e970c11ab107100ed8d06fe31c3e243e00bc9a083e18ffd672ed.jpg",
      "followers": 8197,
      "following": 149,
      "lensScore": 9997
    },
    {
      "id": "0x04b362",
      "name": "lens/paulpoint",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/22b8bb0091ea741d7bfe6aef7421d16e2890e42ea169d1be14a146376f4f8cc8.jpg",
      "followers": 4558,
      "following": 356,
      "lensScore": 9996
    },
    {
      "id": "0x0105f8",
      "name": "lens/brenna",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/f6c156cf48f7415f6462697344b79978912778c5c2fe48964426f08ef3a05712.jpg",
      "followers": 9083,
      "following": 253,
      "lensScore": 9996
    },
    {
      "id": "0xad4c",
      "name": "lens/csjoanna",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/8ef7187ac1b3e22cd87c5ad3cee91d95268496fc1ca076106ad710823aabc595.webp",
      "followers": 2892,
      "following": 131,
      "lensScore": 9997
    },
    {
      "id": "0x013e31",
      "name": "lens/hollins",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/749357a15a7111e4f39df2b22bf62fba534a754a3cc28c028e82caf5c83c2f7c.jpg",
      "followers": 6188,
      "following": 148,
      "lensScore": 9997
    },
    {
      "id": "0x2b9a",
      "name": "lens/0xmoe",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/c530a181fcd7df8565daa7251de1696a558be40723da2457697a34dc69eae0f1.webp",
      "followers": 34650,
      "following": 710,
      "lensScore": 9997
    },
    {
      "id": "0x021831",
      "name": "lens/dylanabruscato",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/55a7e9767f0db6942d4508498c6eef4273d4174d8a32f6fce74c340363d1e9a9.jpg",
      "followers": 11775,
      "following": 49,
      "lensScore": 9997
    },
    {
      "id": "0x07fec1",
      "name": "lens/demoad",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/79d34db70fcf59d47a41c1819aafd9d0c27ec2eff058d1da669bd42060a3796d.jpg",
      "followers": 11672,
      "following": 124,
      "lensScore": 9997
    },
    {
      "id": "0x07b2b1",
      "name": "lens/thehugxyz",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/0ec1caeaec632f3e4e1089e75beded31dd7b01d4a44faf9373c0467902837dd0.jpg",
      "followers": 3528,
      "following": 22,
      "lensScore": 9997
    },
    {
      "id": "0x06b52a",
      "name": "lens/allships",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/3e3e483eca6deaee660698d4d88e6976f588ca0d88258308367aabb5ce6d8706.webp",
      "followers": 14339,
      "following": 105,
      "lensScore": 9997
    },
    {
      "id": "0x03813f",
      "name": "lens/davekrugman",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/be089ad1ba938d90a9270977a784d551f49ca3621773e905de71be395d086808.jpg",
      "followers": 19177,
      "following": 46,
      "lensScore": 9997
    },
    {
      "id": "0x059001",
      "name": "lens/conniebakshi",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/a319f1f463169dc6639d702c1ebc9bee2a03ad5acac1c9584f1da3d792c23303.jpg",
      "followers": 3275,
      "following": 27,
      "lensScore": 9997
    },
    {
      "id": "0x01d898",
      "name": "lens/thisweekon",
      "picture": "https://gw.ipfs-lens.dev/ipfs/QmZbmoHfxSJFJVR6TZFTHDghtZtazAQ8RE2U411h4vxUSs",
      "followers": 7947,
      "following": 45,
      "lensScore": 9997
    },
    {
      "id": "0x8dc6",
      "name": "lens/ibraheem",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/edc665ad21bca4d89113a7b36d821edc0cebc8f10a8170a4db4681df0d460b18.jpg",
      "followers": 6383,
      "following": 145,
      "lensScore": 9997
    },
    {
      "id": "0x0779e2",
      "name": "lens/zenshortz",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/ee07a904104ab97a1e0ae9018e8fa651a7ee6ea20cbc8b65528bf693ef0c5709.jpg",
      "followers": 6872,
      "following": 51,
      "lensScore": 9997
    },
    {
      "id": "0x018602",
      "name": "lens/sirsu",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/c8a179ca7d3f739ecb55d2a8116ace96f0bc4912a66ec990cf7b45f2a9e39971.png",
      "followers": 3388,
      "following": 53,
      "lensScore": 9997
    },
    {
      "id": "0x0ce1",
      "name": "lens/levy",
      "picture": "https://gw.ipfs-lens.dev/ipfs/QmRMXMDjCMf3LoWuJyC3EYn3bcitSXojmwXxQB4YeVi7V1",
      "followers": 56543,
      "following": 60,
      "lensScore": 9998
    },
    {
      "id": "0x612e",
      "name": "lens/soundoffractures",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/e409c95efa83730937b3e04339adaa2f23bda8e770cb63aff1acbad336e40989.jpg",
      "followers": 32449,
      "following": 104,
      "lensScore": 9998
    },
    {
      "id": "0x0506db",
      "name": "lens/proofofvibes",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/1964713fa76e5102beecde9c3198c38655d7f042daee5208f92d3b402066d874.gif",
      "followers": 4234,
      "following": 106,
      "lensScore": 9996
    },
    {
      "id": "0x044460",
      "name": "lens/luckystar",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/4e2eb4572d15ebe44c4cff92ef97f3b7025b9662ec4831db655fb7818dfe6bb0.png",
      "followers": 1564,
      "following": 48,
      "lensScore": 9997
    },
    {
      "id": "0x013972",
      "name": "lens/leopastel",
      "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeigk6n6skec2zl35spyy4fenht43qblffvyt6q5uxsj3svwypr3oom",
      "followers": 15138,
      "following": 153,
      "lensScore": 9997
    },
    {
      "id": "0x81a1",
      "name": "lens/crittie",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/e04b7e7bc1438679ac11e4d364611c550135adc248e1ef50e10aa13268194389.png",
      "followers": 5755,
      "following": 285,
      "lensScore": 9997
    },
    {
      "id": "0x018542",
      "name": "lens/debsoon",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/00296d237d71e419bd4d8a5208cee9c00ff2116a76919c3b17cf03c2ec9aef16.jpg",
      "followers": 3108,
      "following": 26,
      "lensScore": 9997
    },
    {
      "id": "0x06de7c",
      "name": "lens/joanakawaharalino",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/70f03f635b40c5e720a415dece75627775e9f6401636a454441bca8d6117e103.webp",
      "followers": 2678,
      "following": 31,
      "lensScore": 9997
    },
    {
      "id": "0x04f1aa",
      "name": "lens/dpop",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/0f6343cb9d302f5dfcce332bf574b9474548f53cbdf3438b6c60345bd199c933.jpg",
      "followers": 4090,
      "following": 5,
      "lensScore": 9997
    },
    {
      "id": "0x227b",
      "name": "lens/shann",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/ce8da704a966841414bf31c6308fb623eac199da6598d33fc566cedc176a650f.png",
      "followers": 2152,
      "following": 64,
      "lensScore": 9996
    },
    {
      "id": "0xe5aa",
      "name": "lens/creators",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/94433507aa6b93a5b6bae9f2ce6a5017e415c64b928edb673510f3d0bfd12e20.png",
      "followers": 18802,
      "following": 345,
      "lensScore": 9996
    },
    {
      "id": "0x04e410",
      "name": "lens/dansickles",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/fa7eb64d10339f17b6cad6d39cdc347d1547c3df84dbc377dae0c6ff43481b0c.webp",
      "followers": 888,
      "following": 29,
      "lensScore": 9996
    },
    {
      "id": "0x020d1f",
      "name": "lens/deadstartalk",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/3d68558c090158f50945a1dac7828c7eb15db6e8301e519c9efb5647c1195d26.png",
      "followers": 5013,
      "following": 720,
      "lensScore": 9995
    },
    {
      "id": "0x05e538",
      "name": "lens/quadrillions",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/3185525ceceeb2e3cbcdfa8aecfc24c25324faa21649814aebf63cb5f0d1d3af.jpg",
      "followers": 14358,
      "following": 143,
      "lensScore": 9995
    },
    {
      "id": "0x02215a",
      "name": "lens/martz",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/1b9f2d60b7cb8d5aebc6076c0db066a8989744c6f466731910d4cd5e0367cdbb.webp",
      "followers": 19010,
      "following": 144,
      "lensScore": 9995
    },
    {
      "id": "0x0446c4",
      "name": "lens/horticulture",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/57c4839d920fab29b897f2687ee0475256779604bbad755053e6c67028594078.png",
      "followers": 17887,
      "following": 317,
      "lensScore": 9995
    },
    {
      "id": "0x019b9b",
      "name": "lens/steph",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/a0769d6f9a1d285abcf011755393a9633e8ce84dd4e0b6d19e0d6190265b43ec.webp",
      "followers": 5050,
      "following": 79,
      "lensScore": 9998
    },
    {
      "id": "0x04efde",
      "name": "lens/mysticgarden",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/7d8cfbc737b25c86630e94357c0703130f9200e380fd93af1f0d42cf6e6f343d.png",
      "followers": 8996,
      "following": 43,
      "lensScore": 9997
    },
    {
      "id": "0x1c1b",
      "name": "lens/boysclub",
      "picture": "https://gw.ipfs-lens.dev/ipfs/bafkreifudtfyzrjanmqp5gjgcr5kajmjwxefulinhnvcnuu4botgnek7ga",
      "followers": 6614,
      "following": 58,
      "lensScore": 9997
    },
    {
      "id": "0x017655",
      "name": "lens/helfetica",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/42cf70a2ebc0309081fe344df00a8a41a5b430f677b93c842e3484b61868ef50.jpg",
      "followers": 25690,
      "following": 218,
      "lensScore": 9997
    },
    {
      "id": "0x01cabc",
      "name": "lens/nftsushi",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/b40d87c79dd75bf907c2b08bcd93f79d133644bf1a247f4217ab2bc0c947c29b.webp",
      "followers": 26010,
      "following": 221,
      "lensScore": 9997
    },
    {
      "id": "0x0554",
      "name": "lens/davekim",
      "picture": "https://gw.ipfs-lens.dev/ipfs/bafkreieoko7h5hcqd22l3lhlv7z7v2su6ftukuwov366rrdswib3t4nj3m",
      "followers": 4717,
      "following": 83,
      "lensScore": 9997
    },
    {
      "id": "0x09",
      "name": "lens/nicolo",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/13ae61a8d876803e7001218c4439e96cbd59237e4a24a5387823836686932981.png",
      "followers": 44468,
      "following": 177,
      "lensScore": 9997
    },
    {
      "id": "0xa9e9",
      "name": "lens/design",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/9ca97685ff3ef320db634fd999576034a71c72ca94f51b1e898b002468eb42e9.png",
      "followers": 15143,
      "following": 23,
      "lensScore": 9996
    },
    {
      "id": "0x09062c",
      "name": "lens/danoliver",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/118fbdfdd5bab602ad9feb450bbd6418dfc95ef3de2a0d502e3eb580fefaf994.jpg",
      "followers": 2678,
      "following": 53,
      "lensScore": 9996
    },
    {
      "id": "0x07acce",
      "name": "lens/moodyink",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/b45a3baa6c921c8305c27123ec9760bba51bf0af9e092a9c17b93c6163ed888b.jpg",
      "followers": 12020,
      "following": 121,
      "lensScore": 9995
    },
    {
      "id": "0xdd33",
      "name": "lens/zkjew",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/aae88562ea344204733bbac7cbb02fb2f7e05513c264596b220d3daf8bf81319.jpg",
      "followers": 42726,
      "following": 340,
      "lensScore": 9995
    },
    {
      "id": "0x01cdb0",
      "name": "lens/iamtherealyakuza",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/5d49e81f6c7690ec1f7144c95e7bfc0d1ca5ceb295d7d258313b65df656f57a2.jpg",
      "followers": 22203,
      "following": 365,
      "lensScore": 9995
    },
    {
      "id": "0x01c623",
      "name": "lens/artbyjah",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/efc9f4dd20c27d4513af1fce2ed36769d136aa58aa012fc8314a421941a2d8e1.webp",
      "followers": 19972,
      "following": 197,
      "lensScore": 9996
    },
    {
      "id": "0x01c74b",
      "name": "lens/kayakiko",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/d9fb540ac0c492894d4e63b304ad5d9e4b12982327f39e51f65d8114aebb52e3.webp",
      "followers": 15442,
      "following": 282,
      "lensScore": 9996
    },
    {
      "id": "0x012a99",
      "name": "lens/tinyrainboot",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/9a41e13127cca7c7bb8175f676d8c34059ef486c1822db022870248887533a1a.png",
      "followers": 37191,
      "following": 863,
      "lensScore": 9996
    },
    {
      "id": "0x018536",
      "name": "lens/mynameisheno",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/e02b7daf00e593cd8723537cb8da974ae10f2715bd006d27acc19afcb1631bca.jpg",
      "followers": 16393,
      "following": 81,
      "lensScore": 9997
    },
    {
      "id": "0x8dbc",
      "name": "lens/blackdave",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/fe2a261af8c1fa560d28ed10e5f046da095ab33d8ad7577f434672d295372ff9.png",
      "followers": 6777,
      "following": 98,
      "lensScore": 9997
    },
    {
      "id": "0x019a2c",
      "name": "lens/finkel",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/f9b5453abf86ed3a3ecbca698b99af31255748ef025be1176195f0b0b6cb68a6.jpg",
      "followers": 4749,
      "following": 102,
      "lensScore": 9997
    },
    {
      "id": "0x020d24",
      "name": "lens/cryptothegame",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/efe4f0f70c7ab95c5a1b099c1329b19a9f0886e54e125443c4983eebd57b0e6b.png",
      "followers": 22758,
      "following": 32,
      "lensScore": 9997
    },
    {
      "id": "0xf934",
      "name": "lens/dfreshmaker",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/86452b54e2c078cec05296a57834e94e25e44691869110f03ed2a224b12f71d9.jpg",
      "followers": 5000,
      "following": 281,
      "lensScore": 9997
    },
    {
      "id": "0x31",
      "name": "lens/mariariivari",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/7d4244f8a67927f5db0324fd2b7d22513f8ff55c97bf21c43aab31de18210856.jpg",
      "followers": 40814,
      "following": 566,
      "lensScore": 9996
    },
    {
      "id": "0x01ed1c",
      "name": "lens/duodomusica",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/386c49c50e85c313fbd42cc701606246ce6a84d4d2e74251a5c79f24bbc445c0.webp",
      "followers": 3206,
      "following": 145,
      "lensScore": 9996
    },
    {
      "id": "0x0102cc",
      "name": "lens/rickydata",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/2d638dd86dea6ece6da3c20ea06d44f9fbce95ceb2ea1cf84e6ff32e69a90699.png",
      "followers": 34659,
      "following": 589,
      "lensScore": 9996
    },
    {
      "id": "0xb087",
      "name": "lens/akiba",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/c8395262eca961933be36ad2904de79f940d8f1bd6d0d9dbec83c5f1fe452774.jpg",
      "followers": 6887,
      "following": 391,
      "lensScore": 9995
    },
    {
      "id": "0xf852",
      "name": "lens/crypto-z",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/6da49731f5771a169518f50110f56539a1baf4b0f44fb0393f8199277626690a.jpg",
      "followers": 4910,
      "following": 79,
      "lensScore": 9997
    },
    {
      "id": "0x01c737",
      "name": "lens/asamisscream",
      "picture": "https://gw.ipfs-lens.dev/ipfs/QmbhRy9BsixeM8W1sxPLxjTggr5A3pAWYHzBJ9FMUYVMtZ",
      "followers": 37853,
      "following": 290,
      "lensScore": 9996
    },
    {
      "id": "0x03f46d",
      "name": "lens/letsglitchit",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/7c0a17b24a284e243c2140984b0154c6599ded897779e270d4027f756a182c28.jpg",
      "followers": 4985,
      "following": 129,
      "lensScore": 9996
    },
    {
      "id": "0x01d0e7",
      "name": "lens/greenpillnetwork",
      "picture": "https://gw.ipfs-lens.dev/ipfs/QmQouaqFXqQEGfPBRxXN8CCBr8x1LCh1sw93NPL5zLZno4",
      "followers": 1353,
      "following": 67,
      "lensScore": 9997
    },
    {
      "id": "0x01b9a5",
      "name": "lens/thefutureofmusic",
      "picture": "https://gw.ipfs-lens.dev/ipfs/bafkreibapomdgn3zdvnm7lnxljhjzyc3oabzvkyqisuqlxq6swjo45cqba",
      "followers": 2431,
      "following": 74,
      "lensScore": 9997
    },
    {
      "id": "0x01ae99",
      "name": "lens/t2world",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/1c7ad8c8f15d4ef3740d5e7a82ffbbb1e7ad4b63bd38e2e7e96887e599b03b5c.png",
      "followers": 45756,
      "following": 343,
      "lensScore": 9996
    },
    {
      "id": "0x01c845",
      "name": "lens/sttsm",
      "picture": "https://gw.ipfs-lens.dev/ipfs/QmdkeTYRYRwBfgePFPzys53crkBT3TaoqUA8zsak8Cti66",
      "followers": 11593,
      "following": 1103,
      "lensScore": 9994
    },
    {
      "id": "0x0170fc",
      "name": "lens/bvdaniel",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/263828607a5d09451ee8278383bdab3e75ca35c16a97bf7caca1d93b4f5c6004.png",
      "followers": 11212,
      "following": 667,
      "lensScore": 9994
    },
    {
      "id": "0x9e0a",
      "name": "lens/nicocapital",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/ad04379d1cf72c4aee04403567d7d7ad75ea20cb3bcb303526c943d5fa87e2a8.png",
      "followers": 14256,
      "following": 743,
      "lensScore": 9993
    },
    {
      "id": "0x5c95",
      "name": "lens/2irl4u",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/1f9aca8e0cb910707e373ccee5cec92edb8ae27042fbf53554fb23c09d7b93ef.jpg",
      "followers": 13830,
      "following": 243,
      "lensScore": 9996
    },
    {
      "id": "0x0522",
      "name": "lens/qingisdead",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/d5c4434cdc26ce4ff776872b8f3694483ebf2372d7a04d90d2cbfb63201b56a0.gif",
      "followers": 16937,
      "following": 456,
      "lensScore": 9995
    },
    {
      "id": "0x019965",
      "name": "lens/fromaatozzz",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/3507ef2d5d4b007183ef534891ded4a468fa732cea3a341dd70fad956f57a3a3.png",
      "followers": 1316,
      "following": 35,
      "lensScore": 9995
    },
    {
      "id": "0x01e9",
      "name": "lens/jozefvogel",
      "picture": "https://gw.ipfs-lens.dev/ipfs/QmR91CcKncf61VTiecEuYF1kiMyhegyM6UHoZCeZ27LoMS",
      "followers": 4258,
      "following": 179,
      "lensScore": 9995
    },
    {
      "id": "0xb175",
      "name": "lens/frederic",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/e4ccd007bf6908fe1aea7dcc5ab6e69591a5ac51c35fdd12ae104d07c16c7e63.png",
      "followers": 4872,
      "following": 172,
      "lensScore": 9994
    },
    {
      "id": "0xd07e",
      "name": "lens/saucypopcorn",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/9dfdfd49b23920df750c93854ac4f3c7a602c27de0acfe1ad8710a1a3cc72e67.jpg",
      "followers": 4220,
      "following": 303,
      "lensScore": 9994
    },
    {
      "id": "0x09f1",
      "name": "lens/xinobi",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/6f2a28f2b2b6ae54535779dbb88adaf46b7e5a05a4c173d0cf730161a51c2ed2.png",
      "followers": 44459,
      "following": 182,
      "lensScore": 9994
    },
    {
      "id": "0xe435",
      "name": "lens/ldf_gm",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/0b75c74e4382aa8760a658eb31aa756fc60cacfe73ee53713e23f4bd799898b8.jpg",
      "followers": 22994,
      "following": 59,
      "lensScore": 9997
    },
    {
      "id": "0x019f08",
      "name": "lens/winny",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/53365da36341c59d3c21853222db52bd912735966c8c8709d602999be4c6b868.png",
      "followers": 20572,
      "following": 75,
      "lensScore": 9996
    },
    {
      "id": "0xc6b9",
      "name": "lens/jacqs",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/8ab46a72ce2910ede41d16944710a6b0b6b767800043153ef701a96b2e737df9.png",
      "followers": 20328,
      "following": 263,
      "lensScore": 9996
    },
    {
      "id": "0x019e34",
      "name": "lens/callmelatasha",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/0ccbd256a43a6c616244675533d42eccf380e1e20e52c07c1877a1e3eee5a221.jpg",
      "followers": 9402,
      "following": 83,
      "lensScore": 9995
    },
    {
      "id": "0x01cc43",
      "name": "lens/kristofer_robins",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/f2a4dbc4ddb6ef4e0bd949eb3589d5bfc61729081fa58576f6b593c55c9d5dcd.jpg",
      "followers": 1622,
      "following": 86,
      "lensScore": 9995
    },
    {
      "id": "0x01c779",
      "name": "lens/upperreality",
      "picture": "https://ik.imagekit.io/lens/media-snapshot/48559fe6f05d06092ab19cda9d3674a09ee49b80565069f82341aa4f464d7a22.jpg",
      "followers": 6544,
      "following": 148,
      "lensScore": 9995
    }
  ],
  "links": [
    {
      "source": "0x081b98",
      "target": "0x021135"
    },
    {
      "source": "0x081b98",
      "target": "0xcd80"
    },
    {
      "source": "0x081b98",
      "target": "0x018981"
    },
    {
      "source": "0x081b98",
      "target": "0x081593"
    },
    {
      "source": "0x081b98",
      "target": "0x25bb"
    },
    {
      "source": "0x081b98",
      "target": "0x01cbd1"
    },
    {
      "source": "0x081b98",
      "target": "0x69f9"
    },
    {
      "source": "0x081b98",
      "target": "0x05"
    },
    {
      "source": "0x081b98",
      "target": "0x5881"
    },
    {
      "source": "0x081b98",
      "target": "0x0145"
    },
    {
      "source": "0x021135",
      "target": "0x01b367"
    },
    {
      "source": "0x021135",
      "target": "0x04d865"
    },
    {
      "source": "0x021135",
      "target": "0x01c1b6"
    },
    {
      "source": "0x021135",
      "target": "0x07f960"
    },
    {
      "source": "0x021135",
      "target": "0x04bd61"
    },
    {
      "source": "0x021135",
      "target": "0x019a20"
    },
    {
      "source": "0x021135",
      "target": "0xce03"
    },
    {
      "source": "0x021135",
      "target": "0x01a6"
    },
    {
      "source": "0x021135",
      "target": "0x01eb28"
    },
    {
      "source": "0x021135",
      "target": "0x019978"
    },
    {
      "source": "0xcd80",
      "target": "0x04d865"
    },
    {
      "source": "0xcd80",
      "target": "0xce03"
    },
    {
      "source": "0xcd80",
      "target": "0x07f960"
    },
    {
      "source": "0xcd80",
      "target": "0x01c1b6"
    },
    {
      "source": "0xcd80",
      "target": "0x01970c"
    },
    {
      "source": "0xcd80",
      "target": "0x01b367"
    },
    {
      "source": "0xcd80",
      "target": "0x04e8bd"
    },
    {
      "source": "0xcd80",
      "target": "0x04bd61"
    },
    {
      "source": "0xcd80",
      "target": "0x021135"
    },
    {
      "source": "0xcd80",
      "target": "0x0491ae"
    },
    {
      "source": "0x018981",
      "target": "0x07f960"
    },
    {
      "source": "0x018981",
      "target": "0x021135"
    },
    {
      "source": "0x018981",
      "target": "0x2057"
    },
    {
      "source": "0x018981",
      "target": "0x01a6"
    },
    {
      "source": "0x018981",
      "target": "0x054fa2"
    },
    {
      "source": "0x018981",
      "target": "0x056934"
    },
    {
      "source": "0x018981",
      "target": "0x01a8ae"
    },
    {
      "source": "0x018981",
      "target": "0xcd80"
    },
    {
      "source": "0x018981",
      "target": "0x015ef2"
    },
    {
      "source": "0x018981",
      "target": "0x1a12"
    },
    {
      "source": "0x081593",
      "target": "0x07f960"
    },
    {
      "source": "0x081593",
      "target": "0x01cae5"
    },
    {
      "source": "0x081593",
      "target": "0xcd80"
    },
    {
      "source": "0x081593",
      "target": "0x01837b"
    },
    {
      "source": "0x081593",
      "target": "0x036a7e"
    },
    {
      "source": "0x081593",
      "target": "0x05d393"
    },
    {
      "source": "0x081593",
      "target": "0x01a698"
    },
    {
      "source": "0x081593",
      "target": "0x018df6"
    },
    {
      "source": "0x081593",
      "target": "0x8e"
    },
    {
      "source": "0x081593",
      "target": "0x083688"
    },
    {
      "source": "0x25bb",
      "target": "0x07f960"
    },
    {
      "source": "0x25bb",
      "target": "0x021135"
    },
    {
      "source": "0x25bb",
      "target": "0x01b000"
    },
    {
      "source": "0x25bb",
      "target": "0x019f4f"
    },
    {
      "source": "0x25bb",
      "target": "0x01cae5"
    },
    {
      "source": "0x25bb",
      "target": "0x01d70e"
    },
    {
      "source": "0x25bb",
      "target": "0x01a8ae"
    },
    {
      "source": "0x25bb",
      "target": "0x056934"
    },
    {
      "source": "0x25bb",
      "target": "0x01c4a6"
    },
    {
      "source": "0x25bb",
      "target": "0xb427"
    },
    {
      "source": "0x01cbd1",
      "target": "0x01a14e"
    },
    {
      "source": "0x01cbd1",
      "target": "0xcd80"
    },
    {
      "source": "0x01cbd1",
      "target": "0xd8"
    },
    {
      "source": "0x01cbd1",
      "target": "0x022ccf"
    },
    {
      "source": "0x01cbd1",
      "target": "0x0210"
    },
    {
      "source": "0x01cbd1",
      "target": "0x01af07"
    },
    {
      "source": "0x01cbd1",
      "target": "0x01a698"
    },
    {
      "source": "0x01cbd1",
      "target": "0x01632e"
    },
    {
      "source": "0x01cbd1",
      "target": "0xa68c"
    },
    {
      "source": "0x01cbd1",
      "target": "0x01d8d5"
    },
    {
      "source": "0x69f9",
      "target": "0x04bd61"
    },
    {
      "source": "0x69f9",
      "target": "0x021135"
    },
    {
      "source": "0x69f9",
      "target": "0x019962"
    },
    {
      "source": "0x69f9",
      "target": "0x01a14e"
    },
    {
      "source": "0x69f9",
      "target": "0x019c14"
    },
    {
      "source": "0x69f9",
      "target": "0x01cae5"
    },
    {
      "source": "0x69f9",
      "target": "0x01c4a6"
    },
    {
      "source": "0x69f9",
      "target": "0x01e397"
    },
    {
      "source": "0x69f9",
      "target": "0x66c3"
    },
    {
      "source": "0x69f9",
      "target": "0xac6a"
    },
    {
      "source": "0x05",
      "target": "0x07f960"
    },
    {
      "source": "0x05",
      "target": "0x01eb28"
    },
    {
      "source": "0x05",
      "target": "0x04d865"
    },
    {
      "source": "0x05",
      "target": "0x04bd61"
    },
    {
      "source": "0x05",
      "target": "0x021135"
    },
    {
      "source": "0x05",
      "target": "0x01970c"
    },
    {
      "source": "0x05",
      "target": "0x01c1b6"
    },
    {
      "source": "0x05",
      "target": "0x01afc5"
    },
    {
      "source": "0x05",
      "target": "0x2057"
    },
    {
      "source": "0x05",
      "target": "0x019a20"
    },
    {
      "source": "0x5881",
      "target": "0x07f960"
    },
    {
      "source": "0x5881",
      "target": "0x01c1b6"
    },
    {
      "source": "0x5881",
      "target": "0x04e8bd"
    },
    {
      "source": "0x5881",
      "target": "0x01b367"
    },
    {
      "source": "0x5881",
      "target": "0x01d1af"
    },
    {
      "source": "0x5881",
      "target": "0x01970c"
    },
    {
      "source": "0x5881",
      "target": "0x04bd61"
    },
    {
      "source": "0x5881",
      "target": "0x021135"
    },
    {
      "source": "0x5881",
      "target": "0x01eb28"
    },
    {
      "source": "0x5881",
      "target": "0x01a6"
    },
    {
      "source": "0x0145",
      "target": "0x01c1b6"
    },
    {
      "source": "0x0145",
      "target": "0x01d0f0"
    },
    {
      "source": "0x0145",
      "target": "0xb427"
    },
    {
      "source": "0x0145",
      "target": "0x01af07"
    },
    {
      "source": "0x0145",
      "target": "0x1087"
    },
    {
      "source": "0x0145",
      "target": "0x0164b5"
    },
    {
      "source": "0x0145",
      "target": "0x01d6da"
    },
    {
      "source": "0x0145",
      "target": "0x01c173"
    },
    {
      "source": "0x0145",
      "target": "0x01c5ff"
    },
    {
      "source": "0x0145",
      "target": "0x01a041"
    },
    {
      "source": "0x01b367",
      "target": "0x021135"
    },
    {
      "source": "0x01b367",
      "target": "0x04bd61"
    },
    {
      "source": "0x01b367",
      "target": "0x01a6"
    },
    {
      "source": "0x01b367",
      "target": "0xce03"
    },
    {
      "source": "0x01b367",
      "target": "0x0e76"
    },
    {
      "source": "0x01b367",
      "target": "0x01d70e"
    },
    {
      "source": "0x01b367",
      "target": "0x6388"
    },
    {
      "source": "0x01b367",
      "target": "0x01cae5"
    },
    {
      "source": "0x01b367",
      "target": "0xcd80"
    },
    {
      "source": "0x01b367",
      "target": "0x04c480"
    },
    {
      "source": "0x04d865",
      "target": "0x021135"
    },
    {
      "source": "0x04d865",
      "target": "0x07f960"
    },
    {
      "source": "0x04d865",
      "target": "0xce03"
    },
    {
      "source": "0x04d865",
      "target": "0x0e76"
    },
    {
      "source": "0x04d865",
      "target": "0xcd80"
    },
    {
      "source": "0x04d865",
      "target": "0x01cae5"
    },
    {
      "source": "0x04d865",
      "target": "0x04b362"
    },
    {
      "source": "0x04d865",
      "target": "0x022ccf"
    },
    {
      "source": "0x04d865",
      "target": "0x0105f8"
    },
    {
      "source": "0x04d865",
      "target": "0x0164b5"
    },
    {
      "source": "0x01c1b6",
      "target": "0x021135"
    },
    {
      "source": "0x01c1b6",
      "target": "0x01a6"
    },
    {
      "source": "0x01c1b6",
      "target": "0x04bd61"
    },
    {
      "source": "0x01c1b6",
      "target": "0xad4c"
    },
    {
      "source": "0x01c1b6",
      "target": "0x013e31"
    },
    {
      "source": "0x01c1b6",
      "target": "0x01a14e"
    },
    {
      "source": "0x01c1b6",
      "target": "0x0e76"
    },
    {
      "source": "0x01c1b6",
      "target": "0xcd80"
    },
    {
      "source": "0x01c1b6",
      "target": "0x2b9a"
    },
    {
      "source": "0x01c1b6",
      "target": "0x021831"
    },
    {
      "source": "0x07f960",
      "target": "0x021135"
    },
    {
      "source": "0x07f960",
      "target": "0x01d70e"
    },
    {
      "source": "0x07f960",
      "target": "0x07fec1"
    },
    {
      "source": "0x07f960",
      "target": "0x019c14"
    },
    {
      "source": "0x07f960",
      "target": "0x015ef2"
    },
    {
      "source": "0x07f960",
      "target": "0x07b2b1"
    },
    {
      "source": "0x07f960",
      "target": "0x6388"
    },
    {
      "source": "0x07f960",
      "target": "0xcd80"
    },
    {
      "source": "0x07f960",
      "target": "0x04b362"
    },
    {
      "source": "0x07f960",
      "target": "0x0164b5"
    },
    {
      "source": "0x04bd61",
      "target": "0x07f960"
    },
    {
      "source": "0x04bd61",
      "target": "0x01a6"
    },
    {
      "source": "0x04bd61",
      "target": "0x021135"
    },
    {
      "source": "0x04bd61",
      "target": "0x07b2b1"
    },
    {
      "source": "0x04bd61",
      "target": "0x019c14"
    },
    {
      "source": "0x04bd61",
      "target": "0x0e76"
    },
    {
      "source": "0x04bd61",
      "target": "0x06b52a"
    },
    {
      "source": "0x04bd61",
      "target": "0x01d70e"
    },
    {
      "source": "0x04bd61",
      "target": "0x03813f"
    },
    {
      "source": "0x04bd61",
      "target": "0x059001"
    },
    {
      "source": "0x019a20",
      "target": "0x04d865"
    },
    {
      "source": "0x019a20",
      "target": "0x04bd61"
    },
    {
      "source": "0x019a20",
      "target": "0x021135"
    },
    {
      "source": "0x019a20",
      "target": "0xce03"
    },
    {
      "source": "0x019a20",
      "target": "0x2057"
    },
    {
      "source": "0x019a20",
      "target": "0x054fa2"
    },
    {
      "source": "0x019a20",
      "target": "0x01d898"
    },
    {
      "source": "0x019a20",
      "target": "0x03813f"
    },
    {
      "source": "0x019a20",
      "target": "0x059001"
    },
    {
      "source": "0x019a20",
      "target": "0x056934"
    },
    {
      "source": "0xce03",
      "target": "0x07f960"
    },
    {
      "source": "0xce03",
      "target": "0x01a6"
    },
    {
      "source": "0xce03",
      "target": "0x021135"
    },
    {
      "source": "0xce03",
      "target": "0x01eb28"
    },
    {
      "source": "0xce03",
      "target": "0x2057"
    },
    {
      "source": "0xce03",
      "target": "0x8dc6"
    },
    {
      "source": "0xce03",
      "target": "0x04c480"
    },
    {
      "source": "0xce03",
      "target": "0x0779e2"
    },
    {
      "source": "0xce03",
      "target": "0x03813f"
    },
    {
      "source": "0xce03",
      "target": "0x018602"
    },
    {
      "source": "0x01a6",
      "target": "0x04d865"
    },
    {
      "source": "0x01a6",
      "target": "0x01b367"
    },
    {
      "source": "0x01a6",
      "target": "0x01970c"
    },
    {
      "source": "0x01a6",
      "target": "0x04bd61"
    },
    {
      "source": "0x01a6",
      "target": "0x01c1b6"
    },
    {
      "source": "0x01a6",
      "target": "0x0ce1"
    },
    {
      "source": "0x01a6",
      "target": "0x2057"
    },
    {
      "source": "0x01a6",
      "target": "0xce03"
    },
    {
      "source": "0x01a6",
      "target": "0x021135"
    },
    {
      "source": "0x01a6",
      "target": "0x612e"
    },
    {
      "source": "0x01eb28",
      "target": "0x021135"
    },
    {
      "source": "0x01eb28",
      "target": "0xce03"
    },
    {
      "source": "0x01eb28",
      "target": "0x2057"
    },
    {
      "source": "0x01eb28",
      "target": "0x6388"
    },
    {
      "source": "0x01eb28",
      "target": "0x04c480"
    },
    {
      "source": "0x01eb28",
      "target": "0x1a12"
    },
    {
      "source": "0x01eb28",
      "target": "0x01d898"
    },
    {
      "source": "0x01eb28",
      "target": "0x0210"
    },
    {
      "source": "0x01eb28",
      "target": "0x0506db"
    },
    {
      "source": "0x01eb28",
      "target": "0x01632e"
    },
    {
      "source": "0x019978",
      "target": "0x01eb28"
    },
    {
      "source": "0x019978",
      "target": "0x021135"
    },
    {
      "source": "0x019978",
      "target": "0x0ce1"
    },
    {
      "source": "0x019978",
      "target": "0x01cae5"
    },
    {
      "source": "0x019978",
      "target": "0x019c14"
    },
    {
      "source": "0x019978",
      "target": "0x044460"
    },
    {
      "source": "0x019978",
      "target": "0x04c480"
    },
    {
      "source": "0x019978",
      "target": "0x8dc6"
    },
    {
      "source": "0x019978",
      "target": "0x013972"
    },
    {
      "source": "0x019978",
      "target": "0x81a1"
    },
    {
      "source": "0x01970c",
      "target": "0x07f960"
    },
    {
      "source": "0x01970c",
      "target": "0x612e"
    },
    {
      "source": "0x01970c",
      "target": "0x01a6"
    },
    {
      "source": "0x01970c",
      "target": "0x018542"
    },
    {
      "source": "0x01970c",
      "target": "0xcd80"
    },
    {
      "source": "0x01970c",
      "target": "0x04c480"
    },
    {
      "source": "0x01970c",
      "target": "0x06de7c"
    },
    {
      "source": "0x01970c",
      "target": "0x01cae5"
    },
    {
      "source": "0x01970c",
      "target": "0x81a1"
    },
    {
      "source": "0x01970c",
      "target": "0x01c4a6"
    },
    {
      "source": "0x04e8bd",
      "target": "0x01cae5"
    },
    {
      "source": "0x04e8bd",
      "target": "0xcd80"
    },
    {
      "source": "0x04e8bd",
      "target": "0x04f1aa"
    },
    {
      "source": "0x04e8bd",
      "target": "0x0210"
    },
    {
      "source": "0x04e8bd",
      "target": "0x018981"
    },
    {
      "source": "0x04e8bd",
      "target": "0x01837b"
    },
    {
      "source": "0x04e8bd",
      "target": "0x227b"
    },
    {
      "source": "0x04e8bd",
      "target": "0xe5aa"
    },
    {
      "source": "0x04e8bd",
      "target": "0x04e410"
    },
    {
      "source": "0x04e8bd",
      "target": "0x020d1f"
    },
    {
      "source": "0x0491ae",
      "target": "0x0e76"
    },
    {
      "source": "0x0491ae",
      "target": "0xcd80"
    },
    {
      "source": "0x0491ae",
      "target": "0x0210"
    },
    {
      "source": "0x0491ae",
      "target": "0xe5aa"
    },
    {
      "source": "0x0491ae",
      "target": "0x01a698"
    },
    {
      "source": "0x0491ae",
      "target": "0x020d1f"
    },
    {
      "source": "0x0491ae",
      "target": "0x05e538"
    },
    {
      "source": "0x0491ae",
      "target": "0x8e"
    },
    {
      "source": "0x0491ae",
      "target": "0x02215a"
    },
    {
      "source": "0x0491ae",
      "target": "0x0446c4"
    },
    {
      "source": "0x2057",
      "target": "0x04d865"
    },
    {
      "source": "0x2057",
      "target": "0x0491ae"
    },
    {
      "source": "0x2057",
      "target": "0x01d1af"
    },
    {
      "source": "0x2057",
      "target": "0x021135"
    },
    {
      "source": "0x2057",
      "target": "0x019b9b"
    },
    {
      "source": "0x2057",
      "target": "0x01eb28"
    },
    {
      "source": "0x2057",
      "target": "0x019a20"
    },
    {
      "source": "0x2057",
      "target": "0x01a6"
    },
    {
      "source": "0x2057",
      "target": "0xce03"
    },
    {
      "source": "0x2057",
      "target": "0x054fa2"
    },
    {
      "source": "0x054fa2",
      "target": "0x021135"
    },
    {
      "source": "0x054fa2",
      "target": "0x07f960"
    },
    {
      "source": "0x054fa2",
      "target": "0x04efde"
    },
    {
      "source": "0x054fa2",
      "target": "0x01a14e"
    },
    {
      "source": "0x054fa2",
      "target": "0x07fec1"
    },
    {
      "source": "0x054fa2",
      "target": "0x0506db"
    },
    {
      "source": "0x054fa2",
      "target": "0x018981"
    },
    {
      "source": "0x054fa2",
      "target": "0x05d393"
    },
    {
      "source": "0x054fa2",
      "target": "0x01a698"
    },
    {
      "source": "0x054fa2",
      "target": "0x020d1f"
    },
    {
      "source": "0x056934",
      "target": "0x01a6"
    },
    {
      "source": "0x056934",
      "target": "0xce03"
    },
    {
      "source": "0x056934",
      "target": "0x04bd61"
    },
    {
      "source": "0x056934",
      "target": "0x021135"
    },
    {
      "source": "0x056934",
      "target": "0x059001"
    },
    {
      "source": "0x056934",
      "target": "0x013e31"
    },
    {
      "source": "0x056934",
      "target": "0x044460"
    },
    {
      "source": "0x056934",
      "target": "0x2b9a"
    },
    {
      "source": "0x056934",
      "target": "0x06de7c"
    },
    {
      "source": "0x056934",
      "target": "0x6388"
    },
    {
      "source": "0x01a8ae",
      "target": "0x01a6"
    },
    {
      "source": "0x01a8ae",
      "target": "0x04c480"
    },
    {
      "source": "0x01a8ae",
      "target": "0x6388"
    },
    {
      "source": "0x01a8ae",
      "target": "0x1c1b"
    },
    {
      "source": "0x01a8ae",
      "target": "0xcd80"
    },
    {
      "source": "0x01a8ae",
      "target": "0x01cae5"
    },
    {
      "source": "0x01a8ae",
      "target": "0x017655"
    },
    {
      "source": "0x01a8ae",
      "target": "0x1a12"
    },
    {
      "source": "0x01a8ae",
      "target": "0x0e76"
    },
    {
      "source": "0x01a8ae",
      "target": "0x01b000"
    },
    {
      "source": "0x015ef2",
      "target": "0x07f960"
    },
    {
      "source": "0x015ef2",
      "target": "0x021135"
    },
    {
      "source": "0x015ef2",
      "target": "0x07fec1"
    },
    {
      "source": "0x015ef2",
      "target": "0x07b2b1"
    },
    {
      "source": "0x015ef2",
      "target": "0x0779e2"
    },
    {
      "source": "0x015ef2",
      "target": "0x06b52a"
    },
    {
      "source": "0x015ef2",
      "target": "0x06de7c"
    },
    {
      "source": "0x015ef2",
      "target": "0x04efde"
    },
    {
      "source": "0x015ef2",
      "target": "0x056934"
    },
    {
      "source": "0x015ef2",
      "target": "0xad4c"
    },
    {
      "source": "0x1a12",
      "target": "0x021135"
    },
    {
      "source": "0x1a12",
      "target": "0x01a8ae"
    },
    {
      "source": "0x1a12",
      "target": "0x017655"
    },
    {
      "source": "0x1a12",
      "target": "0x01a14e"
    },
    {
      "source": "0x1a12",
      "target": "0x01cabc"
    },
    {
      "source": "0x1a12",
      "target": "0x0e76"
    },
    {
      "source": "0x1a12",
      "target": "0x0554"
    },
    {
      "source": "0x1a12",
      "target": "0x09"
    },
    {
      "source": "0x1a12",
      "target": "0xa9e9"
    },
    {
      "source": "0x1a12",
      "target": "0x0164b5"
    },
    {
      "source": "0x01cae5",
      "target": "0x01b367"
    },
    {
      "source": "0x01cae5",
      "target": "0x01a6"
    },
    {
      "source": "0x01cae5",
      "target": "0x04d865"
    },
    {
      "source": "0x01cae5",
      "target": "0x019978"
    },
    {
      "source": "0x01cae5",
      "target": "0x021135"
    },
    {
      "source": "0x01cae5",
      "target": "0xcd80"
    },
    {
      "source": "0x01cae5",
      "target": "0x6388"
    },
    {
      "source": "0x01cae5",
      "target": "0x01a8ae"
    },
    {
      "source": "0x01cae5",
      "target": "0x04c480"
    },
    {
      "source": "0x01cae5",
      "target": "0x019962"
    },
    {
      "source": "0x01837b",
      "target": "0x07f960"
    },
    {
      "source": "0x01837b",
      "target": "0x04bd61"
    },
    {
      "source": "0x01837b",
      "target": "0x2057"
    },
    {
      "source": "0x01837b",
      "target": "0x612e"
    },
    {
      "source": "0x01837b",
      "target": "0x021135"
    },
    {
      "source": "0x01837b",
      "target": "0x01a6"
    },
    {
      "source": "0x01837b",
      "target": "0x6388"
    },
    {
      "source": "0x01837b",
      "target": "0x056934"
    },
    {
      "source": "0x01837b",
      "target": "0xb427"
    },
    {
      "source": "0x01837b",
      "target": "0x04efde"
    },
    {
      "source": "0x036a7e",
      "target": "0x01a6"
    },
    {
      "source": "0x036a7e",
      "target": "0x05d393"
    },
    {
      "source": "0x036a7e",
      "target": "0x018981"
    },
    {
      "source": "0x036a7e",
      "target": "0x09062c"
    },
    {
      "source": "0x036a7e",
      "target": "0x01af07"
    },
    {
      "source": "0x036a7e",
      "target": "0x1087"
    },
    {
      "source": "0x036a7e",
      "target": "0x083688"
    },
    {
      "source": "0x036a7e",
      "target": "0x07acce"
    },
    {
      "source": "0x036a7e",
      "target": "0xdd33"
    },
    {
      "source": "0x036a7e",
      "target": "0x01cdb0"
    },
    {
      "source": "0x05d393",
      "target": "0x07f960"
    },
    {
      "source": "0x05d393",
      "target": "0x01a6"
    },
    {
      "source": "0x05d393",
      "target": "0x6388"
    },
    {
      "source": "0x05d393",
      "target": "0x07fec1"
    },
    {
      "source": "0x05d393",
      "target": "0x054fa2"
    },
    {
      "source": "0x05d393",
      "target": "0x04c480"
    },
    {
      "source": "0x05d393",
      "target": "0x01a14e"
    },
    {
      "source": "0x05d393",
      "target": "0xb427"
    },
    {
      "source": "0x05d393",
      "target": "0x04b362"
    },
    {
      "source": "0x05d393",
      "target": "0x01c623"
    },
    {
      "source": "0x01a698",
      "target": "0x07f960"
    },
    {
      "source": "0x01a698",
      "target": "0x01c1b6"
    },
    {
      "source": "0x01a698",
      "target": "0x0491ae"
    },
    {
      "source": "0x01a698",
      "target": "0x059001"
    },
    {
      "source": "0x01a698",
      "target": "0xad4c"
    },
    {
      "source": "0x01a698",
      "target": "0x054fa2"
    },
    {
      "source": "0x01a698",
      "target": "0x01cae5"
    },
    {
      "source": "0x01a698",
      "target": "0x019f4f"
    },
    {
      "source": "0x01a698",
      "target": "0x2b9a"
    },
    {
      "source": "0x01a698",
      "target": "0x015ef2"
    },
    {
      "source": "0x018df6",
      "target": "0x04d865"
    },
    {
      "source": "0x018df6",
      "target": "0x01afc5"
    },
    {
      "source": "0x018df6",
      "target": "0x01b367"
    },
    {
      "source": "0x018df6",
      "target": "0x0ce1"
    },
    {
      "source": "0x018df6",
      "target": "0x021135"
    },
    {
      "source": "0x018df6",
      "target": "0x01a6"
    },
    {
      "source": "0x018df6",
      "target": "0x019978"
    },
    {
      "source": "0x018df6",
      "target": "0x6388"
    },
    {
      "source": "0x018df6",
      "target": "0x017655"
    },
    {
      "source": "0x018df6",
      "target": "0x019c14"
    },
    {
      "source": "0x8e",
      "target": "0x07f960"
    },
    {
      "source": "0x8e",
      "target": "0x04bd61"
    },
    {
      "source": "0x8e",
      "target": "0x0491ae"
    },
    {
      "source": "0x8e",
      "target": "0x01d1af"
    },
    {
      "source": "0x8e",
      "target": "0x021135"
    },
    {
      "source": "0x8e",
      "target": "0x0ce1"
    },
    {
      "source": "0x8e",
      "target": "0x01eb28"
    },
    {
      "source": "0x8e",
      "target": "0xce03"
    },
    {
      "source": "0x8e",
      "target": "0x019b9b"
    },
    {
      "source": "0x8e",
      "target": "0x01c1b6"
    },
    {
      "source": "0x083688",
      "target": "0x04d865"
    },
    {
      "source": "0x083688",
      "target": "0x01eb28"
    },
    {
      "source": "0x083688",
      "target": "0x01a6"
    },
    {
      "source": "0x083688",
      "target": "0x07f960"
    },
    {
      "source": "0x083688",
      "target": "0x021135"
    },
    {
      "source": "0x083688",
      "target": "0x6388"
    },
    {
      "source": "0x083688",
      "target": "0x07fec1"
    },
    {
      "source": "0x083688",
      "target": "0x05d393"
    },
    {
      "source": "0x083688",
      "target": "0x09062c"
    },
    {
      "source": "0x083688",
      "target": "0x04b362"
    },
    {
      "source": "0x01b000",
      "target": "0x021135"
    },
    {
      "source": "0x01b000",
      "target": "0x019b9b"
    },
    {
      "source": "0x01b000",
      "target": "0x01a14e"
    },
    {
      "source": "0x01b000",
      "target": "0x018602"
    },
    {
      "source": "0x01b000",
      "target": "0x01cabc"
    },
    {
      "source": "0x01b000",
      "target": "0x2b9a"
    },
    {
      "source": "0x01b000",
      "target": "0x01a8ae"
    },
    {
      "source": "0x01b000",
      "target": "0x01c74b"
    },
    {
      "source": "0x01b000",
      "target": "0x036a7e"
    },
    {
      "source": "0x01b000",
      "target": "0x012a99"
    },
    {
      "source": "0x019f4f",
      "target": "0x6388"
    },
    {
      "source": "0x019f4f",
      "target": "0x018536"
    },
    {
      "source": "0x019f4f",
      "target": "0x01d0f0"
    },
    {
      "source": "0x019f4f",
      "target": "0x81a1"
    },
    {
      "source": "0x019f4f",
      "target": "0x8dbc"
    },
    {
      "source": "0x019f4f",
      "target": "0x017655"
    },
    {
      "source": "0x019f4f",
      "target": "0x019962"
    },
    {
      "source": "0x019f4f",
      "target": "0x019a2c"
    },
    {
      "source": "0x019f4f",
      "target": "0x013972"
    },
    {
      "source": "0x019f4f",
      "target": "0x0105f8"
    },
    {
      "source": "0x01d70e",
      "target": "0x07f960"
    },
    {
      "source": "0x01d70e",
      "target": "0x04bd61"
    },
    {
      "source": "0x01d70e",
      "target": "0x021135"
    },
    {
      "source": "0x01d70e",
      "target": "0x019c14"
    },
    {
      "source": "0x01d70e",
      "target": "0x66c3"
    },
    {
      "source": "0x01d70e",
      "target": "0x018542"
    },
    {
      "source": "0x01d70e",
      "target": "0x6388"
    },
    {
      "source": "0x01d70e",
      "target": "0x0e76"
    },
    {
      "source": "0x01d70e",
      "target": "0xcd80"
    },
    {
      "source": "0x01d70e",
      "target": "0x020d24"
    },
    {
      "source": "0x01c4a6",
      "target": "0x612e"
    },
    {
      "source": "0x01c4a6",
      "target": "0x021135"
    },
    {
      "source": "0x01c4a6",
      "target": "0x2057"
    },
    {
      "source": "0x01c4a6",
      "target": "0x01b367"
    },
    {
      "source": "0x01c4a6",
      "target": "0x01970c"
    },
    {
      "source": "0x01c4a6",
      "target": "0x06de7c"
    },
    {
      "source": "0x01c4a6",
      "target": "0x04c480"
    },
    {
      "source": "0x01c4a6",
      "target": "0xf934"
    },
    {
      "source": "0x01c4a6",
      "target": "0x31"
    },
    {
      "source": "0x01c4a6",
      "target": "0x0164b5"
    },
    {
      "source": "0xb427",
      "target": "0x01cabc"
    },
    {
      "source": "0xb427",
      "target": "0x04b362"
    },
    {
      "source": "0xb427",
      "target": "0x05d393"
    },
    {
      "source": "0xb427",
      "target": "0x01837b"
    },
    {
      "source": "0xb427",
      "target": "0x01ed1c"
    },
    {
      "source": "0xb427",
      "target": "0x01af07"
    },
    {
      "source": "0xb427",
      "target": "0x0164b5"
    },
    {
      "source": "0xb427",
      "target": "0x0102cc"
    },
    {
      "source": "0xb427",
      "target": "0x020d1f"
    },
    {
      "source": "0xb427",
      "target": "0xb087"
    },
    {
      "source": "0x01a14e",
      "target": "0x07f960"
    },
    {
      "source": "0x01a14e",
      "target": "0x01c1b6"
    },
    {
      "source": "0x01a14e",
      "target": "0x04bd61"
    },
    {
      "source": "0x01a14e",
      "target": "0x021135"
    },
    {
      "source": "0x01a14e",
      "target": "0x01a6"
    },
    {
      "source": "0x01a14e",
      "target": "0x6388"
    },
    {
      "source": "0x01a14e",
      "target": "0x054fa2"
    },
    {
      "source": "0x01a14e",
      "target": "0xf852"
    },
    {
      "source": "0x01a14e",
      "target": "0x017655"
    },
    {
      "source": "0x01a14e",
      "target": "0x04c480"
    },
    {
      "source": "0xd8",
      "target": "0x021135"
    },
    {
      "source": "0xd8",
      "target": "0x01a6"
    },
    {
      "source": "0xd8",
      "target": "0xf852"
    },
    {
      "source": "0xd8",
      "target": "0x6388"
    },
    {
      "source": "0xd8",
      "target": "0x01cae5"
    },
    {
      "source": "0xd8",
      "target": "0xcd80"
    },
    {
      "source": "0xd8",
      "target": "0x01a14e"
    },
    {
      "source": "0xd8",
      "target": "0x0e76"
    },
    {
      "source": "0xd8",
      "target": "0x0554"
    },
    {
      "source": "0xd8",
      "target": "0x019c14"
    },
    {
      "source": "0x022ccf",
      "target": "0x04d865"
    },
    {
      "source": "0x022ccf",
      "target": "0x01a6"
    },
    {
      "source": "0x022ccf",
      "target": "0x0ce1"
    },
    {
      "source": "0x022ccf",
      "target": "0x021135"
    },
    {
      "source": "0x022ccf",
      "target": "0x0e76"
    },
    {
      "source": "0x022ccf",
      "target": "0x2b9a"
    },
    {
      "source": "0x022ccf",
      "target": "0x01d898"
    },
    {
      "source": "0x022ccf",
      "target": "0x04efde"
    },
    {
      "source": "0x022ccf",
      "target": "0x01cae5"
    },
    {
      "source": "0x022ccf",
      "target": "0x01a14e"
    },
    {
      "source": "0x0210",
      "target": "0x01eb28"
    },
    {
      "source": "0x0210",
      "target": "0xce03"
    },
    {
      "source": "0x0210",
      "target": "0x01970c"
    },
    {
      "source": "0x0210",
      "target": "0x01b367"
    },
    {
      "source": "0x0210",
      "target": "0x0491ae"
    },
    {
      "source": "0x0210",
      "target": "0x07f960"
    },
    {
      "source": "0x0210",
      "target": "0x04bd61"
    },
    {
      "source": "0x0210",
      "target": "0x019978"
    },
    {
      "source": "0x0210",
      "target": "0x021135"
    },
    {
      "source": "0x0210",
      "target": "0x01a6"
    },
    {
      "source": "0x01af07",
      "target": "0x01a6"
    },
    {
      "source": "0x01af07",
      "target": "0x07f960"
    },
    {
      "source": "0x01af07",
      "target": "0x021135"
    },
    {
      "source": "0x01af07",
      "target": "0xce03"
    },
    {
      "source": "0x01af07",
      "target": "0x2057"
    },
    {
      "source": "0x01af07",
      "target": "0x06b52a"
    },
    {
      "source": "0x01af07",
      "target": "0xcd80"
    },
    {
      "source": "0x01af07",
      "target": "0x81a1"
    },
    {
      "source": "0x01af07",
      "target": "0x017655"
    },
    {
      "source": "0x01af07",
      "target": "0x8dc6"
    },
    {
      "source": "0x01632e",
      "target": "0x021135"
    },
    {
      "source": "0x01632e",
      "target": "0xcd80"
    },
    {
      "source": "0x01632e",
      "target": "0x0e76"
    },
    {
      "source": "0x01632e",
      "target": "0x01a14e"
    },
    {
      "source": "0x01632e",
      "target": "0x05d393"
    },
    {
      "source": "0x01632e",
      "target": "0x01c74b"
    },
    {
      "source": "0x01632e",
      "target": "0x01c737"
    },
    {
      "source": "0x01632e",
      "target": "0x01837b"
    },
    {
      "source": "0x01632e",
      "target": "0x03f46d"
    },
    {
      "source": "0x01632e",
      "target": "0x018981"
    },
    {
      "source": "0xa68c",
      "target": "0x2057"
    },
    {
      "source": "0xa68c",
      "target": "0x021135"
    },
    {
      "source": "0xa68c",
      "target": "0x01a6"
    },
    {
      "source": "0xa68c",
      "target": "0x019a20"
    },
    {
      "source": "0xa68c",
      "target": "0x01cae5"
    },
    {
      "source": "0xa68c",
      "target": "0x0e76"
    },
    {
      "source": "0xa68c",
      "target": "0x056934"
    },
    {
      "source": "0xa68c",
      "target": "0x2b9a"
    },
    {
      "source": "0xa68c",
      "target": "0x020d24"
    },
    {
      "source": "0xa68c",
      "target": "0xcd80"
    },
    {
      "source": "0x01d8d5",
      "target": "0x07f960"
    },
    {
      "source": "0x01d8d5",
      "target": "0x01a6"
    },
    {
      "source": "0x01d8d5",
      "target": "0x07fec1"
    },
    {
      "source": "0x01d8d5",
      "target": "0x04efde"
    },
    {
      "source": "0x01d8d5",
      "target": "0x6388"
    },
    {
      "source": "0x01d8d5",
      "target": "0x8dc6"
    },
    {
      "source": "0x01d8d5",
      "target": "0x019c14"
    },
    {
      "source": "0x01d8d5",
      "target": "0x015ef2"
    },
    {
      "source": "0x01d8d5",
      "target": "0xb427"
    },
    {
      "source": "0x01d8d5",
      "target": "0x01d0e7"
    },
    {
      "source": "0x019962",
      "target": "0x07f960"
    },
    {
      "source": "0x019962",
      "target": "0x021135"
    },
    {
      "source": "0x019962",
      "target": "0x612e"
    },
    {
      "source": "0x019962",
      "target": "0x019c14"
    },
    {
      "source": "0x019962",
      "target": "0x04c480"
    },
    {
      "source": "0x019962",
      "target": "0x01c4a6"
    },
    {
      "source": "0x019962",
      "target": "0x01a14e"
    },
    {
      "source": "0x019962",
      "target": "0x81a1"
    },
    {
      "source": "0x019962",
      "target": "0x018536"
    },
    {
      "source": "0x019962",
      "target": "0x01b9a5"
    },
    {
      "source": "0x019c14",
      "target": "0x07f960"
    },
    {
      "source": "0x019c14",
      "target": "0xce03"
    },
    {
      "source": "0x019c14",
      "target": "0x019a20"
    },
    {
      "source": "0x019c14",
      "target": "0x01a6"
    },
    {
      "source": "0x019c14",
      "target": "0x019978"
    },
    {
      "source": "0x019c14",
      "target": "0x021135"
    },
    {
      "source": "0x019c14",
      "target": "0x01b367"
    },
    {
      "source": "0x019c14",
      "target": "0x2057"
    },
    {
      "source": "0x019c14",
      "target": "0x6388"
    },
    {
      "source": "0x019c14",
      "target": "0x06b52a"
    },
    {
      "source": "0x01e397",
      "target": "0x05d393"
    },
    {
      "source": "0x01e397",
      "target": "0x31"
    },
    {
      "source": "0x01e397",
      "target": "0x01af07"
    },
    {
      "source": "0x01e397",
      "target": "0x01ae99"
    },
    {
      "source": "0x01e397",
      "target": "0x020d1f"
    },
    {
      "source": "0x01e397",
      "target": "0x01c845"
    },
    {
      "source": "0x01e397",
      "target": "0x05"
    },
    {
      "source": "0x01e397",
      "target": "0x69f9"
    },
    {
      "source": "0x01e397",
      "target": "0x0170fc"
    },
    {
      "source": "0x01e397",
      "target": "0x9e0a"
    },
    {
      "source": "0x66c3",
      "target": "0x07f960"
    },
    {
      "source": "0x66c3",
      "target": "0x021135"
    },
    {
      "source": "0x66c3",
      "target": "0x01a14e"
    },
    {
      "source": "0x66c3",
      "target": "0x07fec1"
    },
    {
      "source": "0x66c3",
      "target": "0x01d70e"
    },
    {
      "source": "0x66c3",
      "target": "0x2b9a"
    },
    {
      "source": "0x66c3",
      "target": "0x01a698"
    },
    {
      "source": "0x66c3",
      "target": "0x01af07"
    },
    {
      "source": "0x66c3",
      "target": "0x0210"
    },
    {
      "source": "0x66c3",
      "target": "0x5c95"
    },
    {
      "source": "0xac6a",
      "target": "0xa68c"
    },
    {
      "source": "0xac6a",
      "target": "0x0522"
    },
    {
      "source": "0xac6a",
      "target": "0x020d1f"
    },
    {
      "source": "0xac6a",
      "target": "0x8e"
    },
    {
      "source": "0xac6a",
      "target": "0x019965"
    },
    {
      "source": "0xac6a",
      "target": "0x01e9"
    },
    {
      "source": "0xac6a",
      "target": "0xb175"
    },
    {
      "source": "0xac6a",
      "target": "0x5881"
    },
    {
      "source": "0xac6a",
      "target": "0xd07e"
    },
    {
      "source": "0xac6a",
      "target": "0x09f1"
    },
    {
      "source": "0x01afc5",
      "target": "0x612e"
    },
    {
      "source": "0x01afc5",
      "target": "0x021135"
    },
    {
      "source": "0x01afc5",
      "target": "0x04bd61"
    },
    {
      "source": "0x01afc5",
      "target": "0x2057"
    },
    {
      "source": "0x01afc5",
      "target": "0x019c14"
    },
    {
      "source": "0x01afc5",
      "target": "0x013e31"
    },
    {
      "source": "0x01afc5",
      "target": "0xe435"
    },
    {
      "source": "0x01afc5",
      "target": "0xcd80"
    },
    {
      "source": "0x01afc5",
      "target": "0x01a14e"
    },
    {
      "source": "0x01afc5",
      "target": "0x0554"
    },
    {
      "source": "0x01d1af",
      "target": "0x07f960"
    },
    {
      "source": "0x01d1af",
      "target": "0x04bd61"
    },
    {
      "source": "0x01d1af",
      "target": "0x01a6"
    },
    {
      "source": "0x01d1af",
      "target": "0x0491ae"
    },
    {
      "source": "0x01d1af",
      "target": "0x2057"
    },
    {
      "source": "0x01d1af",
      "target": "0x021135"
    },
    {
      "source": "0x01d1af",
      "target": "0x019b9b"
    },
    {
      "source": "0x01d1af",
      "target": "0x01c1b6"
    },
    {
      "source": "0x01d1af",
      "target": "0x06b52a"
    },
    {
      "source": "0x01d1af",
      "target": "0x6388"
    },
    {
      "source": "0x01d0f0",
      "target": "0xce03"
    },
    {
      "source": "0x01d0f0",
      "target": "0x01a6"
    },
    {
      "source": "0x01d0f0",
      "target": "0x6388"
    },
    {
      "source": "0x01d0f0",
      "target": "0x013e31"
    },
    {
      "source": "0x01d0f0",
      "target": "0xcd80"
    },
    {
      "source": "0x01d0f0",
      "target": "0x017655"
    },
    {
      "source": "0x01d0f0",
      "target": "0xe435"
    },
    {
      "source": "0x01d0f0",
      "target": "0x01af07"
    },
    {
      "source": "0x01d0f0",
      "target": "0x019f08"
    },
    {
      "source": "0x01d0f0",
      "target": "0x01632e"
    },
    {
      "source": "0x1087",
      "target": "0x07f960"
    },
    {
      "source": "0x1087",
      "target": "0x021135"
    },
    {
      "source": "0x1087",
      "target": "0x01d1af"
    },
    {
      "source": "0x1087",
      "target": "0x2057"
    },
    {
      "source": "0x1087",
      "target": "0x019978"
    },
    {
      "source": "0x1087",
      "target": "0x01a6"
    },
    {
      "source": "0x1087",
      "target": "0x019a20"
    },
    {
      "source": "0x1087",
      "target": "0x612e"
    },
    {
      "source": "0x1087",
      "target": "0x07b2b1"
    },
    {
      "source": "0x1087",
      "target": "0x015ef2"
    },
    {
      "source": "0x0164b5",
      "target": "0x07f960"
    },
    {
      "source": "0x0164b5",
      "target": "0x021135"
    },
    {
      "source": "0x0164b5",
      "target": "0x01eb28"
    },
    {
      "source": "0x0164b5",
      "target": "0x01a6"
    },
    {
      "source": "0x0164b5",
      "target": "0x2057"
    },
    {
      "source": "0x0164b5",
      "target": "0x6388"
    },
    {
      "source": "0x0164b5",
      "target": "0x019f4f"
    },
    {
      "source": "0x0164b5",
      "target": "0xb427"
    },
    {
      "source": "0x0164b5",
      "target": "0x04c480"
    },
    {
      "source": "0x0164b5",
      "target": "0x01c4a6"
    },
    {
      "source": "0x01d6da",
      "target": "0x07b2b1"
    },
    {
      "source": "0x01d6da",
      "target": "0x0210"
    },
    {
      "source": "0x01d6da",
      "target": "0x31"
    },
    {
      "source": "0x01d6da",
      "target": "0x01a698"
    },
    {
      "source": "0x01d6da",
      "target": "0xc6b9"
    },
    {
      "source": "0x01d6da",
      "target": "0x0164b5"
    },
    {
      "source": "0x01d6da",
      "target": "0xe5aa"
    },
    {
      "source": "0x01d6da",
      "target": "0x019e34"
    },
    {
      "source": "0x01d6da",
      "target": "0x01cc43"
    },
    {
      "source": "0x01d6da",
      "target": "0x01c779"
    },
    {
      "source": "0x01c173",
      "target": "0xcd80"
    },
    {
      "source": "0x01c173",
      "target": "0xb427"
    },
    {
      "source": "0x01c173",
      "target": "0x019c14"
    },
    {
      "source": "0x01c173",
      "target": "0x0e76"
    },
    {
      "source": "0x01c173",
      "target": "0x2b9a"
    },
    {
      "source": "0x01c173",
      "target": "0x31"
    },
    {
      "source": "0x01c173",
      "target": "0x01632e"
    },
    {
      "source": "0x01c173",
      "target": "0x5c95"
    },
    {
      "source": "0x01c173",
      "target": "0x0164b5"
    },
    {
      "source": "0x01c173",
      "target": "0x0210"
    },
    {
      "source": "0x01c5ff",
      "target": "0x01a6"
    },
    {
      "source": "0x01c5ff",
      "target": "0x021135"
    },
    {
      "source": "0x01c5ff",
      "target": "0x01970c"
    },
    {
      "source": "0x01c5ff",
      "target": "0x018536"
    },
    {
      "source": "0x01c5ff",
      "target": "0x015ef2"
    },
    {
      "source": "0x01c5ff",
      "target": "0x0e76"
    },
    {
      "source": "0x01c5ff",
      "target": "0x01d70e"
    },
    {
      "source": "0x01c5ff",
      "target": "0x019a2c"
    },
    {
      "source": "0x01c5ff",
      "target": "0x019962"
    },
    {
      "source": "0x01c5ff",
      "target": "0x04c480"
    },
    {
      "source": "0x01a041",
      "target": "0x021135"
    },
    {
      "source": "0x01a041",
      "target": "0x01d1af"
    },
    {
      "source": "0x01a041",
      "target": "0x019c14"
    },
    {
      "source": "0x01a041",
      "target": "0x01d0e7"
    },
    {
      "source": "0x01a041",
      "target": "0x2b9a"
    },
    {
      "source": "0x01a041",
      "target": "0x01632e"
    },
    {
      "source": "0x01a041",
      "target": "0x0105f8"
    },
    {
      "source": "0x01a041",
      "target": "0x03f46d"
    },
    {
      "source": "0x01a041",
      "target": "0x1087"
    },
    {
      "source": "0x01a041",
      "target": "0x0164b5"
    }
  ]
}; 