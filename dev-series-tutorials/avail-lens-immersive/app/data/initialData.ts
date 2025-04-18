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
    posts: node.posts || 0,
    lensReputationScore: node.lensReputationScore,
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
          "id": "0x1A8113f4198f8df6394b4283FB4787C4e250072B3",
          "name": "lens/avail_project",
          "picture": "https://ik.imagekit.io/lens/4169f883bec8b1062a8b1c74d54200573113eeb3a26a144a1423cea985dc429b_URZnTKzEe.webp",
          "followers": 720,
          "following": 7,
          "lensScore": 9990,
          "posts": 15
      },
      {
          "id": "0x1cd620a65cF58684d75c0D79768CE11acc9E5DC0c",
          "name": "lens/pedrovilela",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafkreievhwj7a5hd56j3buaqcjwr473wf3e2onir23l6rkh56o6rbeuxdy",
          "followers": 52557,
          "following": 908,
          "lensScore": 9997,
          "posts": 3702
      },
      {
          "id": "0x18273B93d90F88F45Cb6D3070F78830b6fF1D1179",
          "name": "lens/simonj",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmQuvw7pRY1B1tycGsDdrxDHynkmYKo3yWc4Xoe1uw3VkN",
          "followers": 18640,
          "following": 741,
          "lensScore": 9997,
          "posts": 1494
      },
      {
          "id": "0x16BE7df3A693Dcc92EBdBf5C18191e3E429dD94d2",
          "name": "lens/aoifeodwyer",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/f58510e2b576d9753288e6c9f579158b30878734c64715c8c3043718e4f4f6df.webp",
          "followers": 25325,
          "following": 443,
          "lensScore": 9996,
          "posts": 1317
      },
      {
          "id": "0x17FB38DD3907CfF25A26334bFA70412B6a23760BD",
          "name": "lens/mp",
          "picture": "https://ik.imagekit.io/lens/67c047058cf3ee8b8259b27f7c04b44ee441676bd01774eee6345fa7993a67df_uyFlRykTwA.jpeg",
          "followers": 31850,
          "following": 496,
          "lensScore": 9995,
          "posts": 1831
      },
      {
          "id": "0x1251fc41F401d23C4c199A3Cd8a4a8B30c6E28142",
          "name": "lens/salti",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeign6sjqaute5tow5sc3yh2zv2efxxfd64rcgfzk2fcx3bdfjsehci",
          "followers": 18501,
          "following": 577,
          "lensScore": 9994,
          "posts": 2476
      },
      {
          "id": "0x10478dDEEbB272Fdc4e33DFCC2dCA7263B02D7bd0",
          "name": "lens/cavernaeremita",
          "picture": "https://ik.imagekit.io/lens/04c75f6beddaa120e29f716501eed08316469406e71d84b893551418c23b5a71_-Wy3FPgRU.webp",
          "followers": 14314,
          "following": 834,
          "lensScore": 9994,
          "posts": 3091
      },
      {
          "id": "0x16D7366dF51E0fb9FF90DaE24534F9E223eb8d7bD",
          "name": "lens/cesare",
          "picture": "https://ik.imagekit.io/lens/11bea4e859f5d52cc733bc514a41962a00a352dd3a1700afbfa6b6aa82c2f653_0fASXC5NeY.webp",
          "followers": 2948,
          "following": 262,
          "lensScore": 9994,
          "posts": 339
      },
      {
          "id": "0x1Ad2c0BEAdE60fb9f7ec5C87bDE8e4c126145F6E7",
          "name": "lens/stani",
          "picture": "https://ik.imagekit.io/lens/3a2f3867270f6bd83db2eb30cf80142b8084bc4827117ec71ed6b2ab26f8feff_UhFFMebD5.png",
          "followers": 139129,
          "following": 1320,
          "lensScore": 9992,
          "posts": 16459
      },
      {
          "id": "0x1E38f01cB7Ee044fb6FF0041D1ef666929e4cbc02",
          "name": "lens/magnaa",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmR9fTiL1ZtPN2cf1fz4666bUNfPGgB1jUQ25o7qGuEaQD",
          "followers": 6520,
          "following": 437,
          "lensScore": 9992,
          "posts": 362
      },
      {
          "id": "0x1cD36E6276F64044c418afC159A0e3848B14B39cd",
          "name": "lens/0xzelda",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/1f993779abae3d21e8ce0e9c640ff931c975c006e12415e677687642ec5c47b7.webp",
          "followers": 24624,
          "following": 662,
          "lensScore": 9991,
          "posts": 23374
      },
      {
          "id": "0x190c2f002bc1D50D08773C7b4ba5cfCFdB3Cfcb31",
          "name": "lens/ialberquilla",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeiazjnftikriiexezaztnczg5cvkaje6p3s4gjaluhg67hmgadrdue",
          "followers": 13485,
          "following": 100,
          "lensScore": 9990,
          "posts": 187
      },
      {
          "id": "0x196374a53B87716f0577C5b4E31327a9E0A354a1b",
          "name": "lens/nilesh",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmNPtrVJb6EVavkfgTfyaeMj18DRTSyRL7VCTVVQ1VE7RB",
          "followers": 52156,
          "following": 2285,
          "lensScore": 9990,
          "posts": 6340
      },
      {
          "id": "0x151F9cb3CDd9434B1d56ed4d3291AF2CA0464feB0",
          "name": "lens/yoginth",
          "picture": "https://ik.imagekit.io/lens/8a4ae342d875e0de6723cf7cd97212401798c50d28e9c1ce2efe858afc13491b_5e9sNnygE.webp",
          "followers": 96880,
          "following": 172,
          "lensScore": 9990,
          "posts": 1177
      },
      {
          "id": "0x176A8a97ec4A173Ff379B4020b6730c9C2ecEE02e",
          "name": "lens/nohussle",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmVJ1ZyoxeosErycscsqK7uakU5tgJhpr3Z9KVg8sXmkRp",
          "followers": 34123,
          "following": 382,
          "lensScore": 9990,
          "posts": 1141
      },
      {
          "id": "0x1042C676E9c3564f3fbB74046d586Bf4d9049c481",
          "name": "lens/mycaleum",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeifvjuf5ptsil6nvo4cyer5m3k2fbuj6cnj54urg5dtuhcyqt2rbua",
          "followers": 11720,
          "following": 620,
          "lensScore": 9990,
          "posts": 1461
      },
      {
          "id": "0x107c2d0dbcC78AA6F77806E4a33bD89cb3d6625bb",
          "name": "lens/injectmewithcapital",
          "picture": "https://ik.imagekit.io/lens/5dce1973e2b34b43a7597425be74f56335a0c7274df29f19cf52134624a72d1c_8p7myw6Fz.webp",
          "followers": 17902,
          "following": 128,
          "lensScore": 9988,
          "posts": 166
      },
      {
          "id": "0x18dF6b0847E7BbBEDF2641229c0AC6736A1121dE5",
          "name": "lens/paulacomesfirst",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmXrSfoMfKjFok7JUz6XhEBbGYYk4PA1hCE3TTYvwimkQy",
          "followers": 1657,
          "following": 42,
          "lensScore": 9987,
          "posts": 192
      },
      {
          "id": "0x16eE00E41Cc3BCfDFd537b266025dB619D7cC3542",
          "name": "lens/elmengin",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmTUpg7Aw9KX3tKYyvvN7XRFKTLBNUNvULcKdH2k37b8PL",
          "followers": 12860,
          "following": 1718,
          "lensScore": 9985,
          "posts": 9681
      },
      {
          "id": "0x15151b163d43aA716D422f2a79CB9e4b1b254Ec7A",
          "name": "lens/saskasandholm",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmUAEX336TgiPGL4rEhFckHqe4gaoB45uDV6YN7vpHiinc",
          "followers": 31512,
          "following": 629,
          "lensScore": 9985,
          "posts": 5137
      },
      {
          "id": "0x1b6D756C8E745389AAE6C922C67D2aA3555aD93b3",
          "name": "lens/eliasvm",
          "picture": "https://ik.imagekit.io/lens/7538a066b81774fb309c1c9ac2913e693ee19e9e17ff101110aba8dbcf2c1ad6_zm0tQm0Fb.webp",
          "followers": 946,
          "following": 198,
          "lensScore": 9984,
          "posts": 1240
      },
      {
          "id": "0x1E31565e104cC74e15B533D225EB97eF5246EF25d",
          "name": "lens/speis",
          "picture": "https://ik.imagekit.io/lens/63a566600fa48c2cf86ad94de32d1c60559ab243da0d6d2a005c3514a295f10d_75kVra7Ca.webp",
          "followers": 5222,
          "following": 707,
          "lensScore": 9983,
          "posts": 433
      },
      {
          "id": "0x11F1Ec2411891Bec63C2b3aa67681583c6B473f71",
          "name": "lens/samthing",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmUBS5b7emBGQ6zY3gP76ccrCVQeck2jUJTsGqehF28FsS",
          "followers": 4876,
          "following": 143,
          "lensScore": 9983,
          "posts": 185
      },
      {
          "id": "0x13726eeD5f7d2a970dbf49F8BA89eD3770dCdf0fF",
          "name": "lens/pawel",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeicueshhkf47464xsom6u7euzlyeucz5livwwxh7dhgxg3h7rwc5om",
          "followers": 1572,
          "following": 117,
          "lensScore": 9982,
          "posts": 159
      },
      {
          "id": "0x138D671E40dBd93E2188F18BB646Dd9a579f1327c",
          "name": "lens/readyplayer1984",
          "picture": "https://ik.imagekit.io/lens/ce4097efd43e38026006c07d6a3f289a75115adf20ad774b3b4045eb4be5ecf0_A949taXi2.png",
          "followers": 5490,
          "following": 267,
          "lensScore": 9982,
          "posts": 362
      },
      {
          "id": "0x13a3e69a77BAA6C50464A2ef2E41849E64372dafB",
          "name": "lens/dantedez",
          "picture": "https://ik.imagekit.io/lens/3282a47f42b022f44d02c58c7c2b6eafc6bce304925391810cf09de1358be3e7_p8RKwYbQU.webp",
          "followers": 1108,
          "following": 250,
          "lensScore": 9981,
          "posts": 1212
      },
      {
          "id": "0x1a9Dc4AE74365B91629eceC26cfF8F6a2705A36b3",
          "name": "lens/sababa",
          "picture": "https://ik.imagekit.io/lens/cb38b6a99a6a2bb6563cdd92bc38d35895a7fcf592d193bfecf82eaadcfa6d56_u6C9umjJDL.webp",
          "followers": 4839,
          "following": 756,
          "lensScore": 9980,
          "posts": 7776
      },
      {
          "id": "0x172BEA315EA96C24af722216Eb2aC92AD05a8B702",
          "name": "lens/panwinyl",
          "picture": "https://ik.imagekit.io/lens/2ca47c7e3bad0a1744e5f1e00af867593247c07caa4400f40b003ea4523a13dd_SkGExqKjyz.png",
          "followers": 20923,
          "following": 1853,
          "lensScore": 9971,
          "posts": 5015
      },
      {
          "id": "0x1910f7cA4a0b29D2b48E054Aa2e0e251Ec144b163",
          "name": "lens/dedsec",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmVUoXTxBEpkxmVF9HK9njubCUWnugdjEoG6esptvW7Saz",
          "followers": 3028,
          "following": 259,
          "lensScore": 9970,
          "posts": 3550
      },
      {
          "id": "0x16CC874B0afdfcE22C08fF6aA89660843FC877c01",
          "name": "lens/surrealist",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeieberku53hmc2uisqgid4b7zmys2wq65zmzd4e2qq5ghvvtaalpke",
          "followers": 2340,
          "following": 1461,
          "lensScore": 9964,
          "posts": 674
      },
      {
          "id": "0x1837Dcf1416d676c94a5759900203b0e55356D886",
          "name": "lens/belgica",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmXUfEofbCvDvnxM6K7Gr9UodUoVxeTSZxLkGw2kYZYVPK",
          "followers": 5877,
          "following": 863,
          "lensScore": 9960,
          "posts": 4370
      },
      {
          "id": "0x1c287F548c2571D1ad66a52d3B4da93FAf612F13d",
          "name": "lens/rahulkr",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmQZ6kHfxjbuyQJemNpSGGJaZUH4a48S7xcZkBXJ1jcQ2c",
          "followers": 4514,
          "following": 283,
          "lensScore": 9958,
          "posts": 1830
      },
      {
          "id": "0x1633Ecf099E1bb1C6ec04d8dC63Da74bAE7646CA9",
          "name": "lens/xyori",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/896940c4d82a7026b196e48c13ccd2471bc93be24505a0bc5ea9281c8d7a0a54.webp",
          "followers": 3850,
          "following": 439,
          "lensScore": 9956,
          "posts": 6066
      },
      {
          "id": "0x132aC97E1069ba630578A344cC9BDd5559554Fe14",
          "name": "lens/isiah",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/ddec52ff4c43780983a8bf20a7ef132a82df9e5894989bb69fb394383f2a90f6.webp",
          "followers": 1244,
          "following": 177,
          "lensScore": 9946,
          "posts": 19
      },
      {
          "id": "0x1062D24760a12F83c4a5b4dc2b13be8fc39D00B2D",
          "name": "lens/princetiwari",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmZP4v5v8Kpoi7UF812UuMVJcgWhkQfLbePGZYo16DYbAx",
          "followers": 3356,
          "following": 587,
          "lensScore": 9927,
          "posts": 1132
      },
      {
          "id": "0x198310a7092E3c1CFbb62eAaDE8e894b941212dC9",
          "name": "lens/cameturtle",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/4c3587b1218c129797d5eeebe463fda08ce6da42e0cd2336e3ec2f7ed7a12e6d.jpg",
          "followers": 19582,
          "following": 384,
          "lensScore": 9896,
          "posts": 1710
      },
      {
          "id": "0x1bD93C6Ef8CC71FFe1aF17d2293d7DB8EC4C75a7d",
          "name": "lens/dancernaut",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/ca423c08c36c07f74505d32324e23856aefefba5ba9e2f8b179def54bb5b9e3a.webp",
          "followers": 50,
          "following": 26,
          "lensScore": 9894,
          "posts": 45
      },
      {
          "id": "0x12DD087F75D3E1A9e77bb3Fe9231deEdd4A191469",
          "name": "lens/robinroy",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/e74375924bd7bf0172573ab0f6528156591bcaedeb8e619d418ed89e0e2de858.webp",
          "followers": 64,
          "following": 26,
          "lensScore": 9861,
          "posts": 75
      },
      {
          "id": "0x1Cfc670A7f42aa50cbC130D9a165F2359185b6A96",
          "name": "lens/jimba",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeiefpk2trtjk5vll2pftgpyljpsh5jnhhzrusrhumw74bs4doasevi",
          "followers": 886,
          "following": 3719,
          "lensScore": 9845,
          "posts": 24
      },
      {
          "id": "0x12580324365160Df43559e40D1a20861B7F6Cf5c6",
          "name": "lens/dndra26",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeig5yzbwytkmlqahzccequirffkzw2kpe47wocmwxbhzblromc52kq",
          "followers": 609,
          "following": 110,
          "lensScore": 9838,
          "posts": 449
      },
      {
          "id": "0x134C52ee55E24094FBaFc02118d5C227C21F8BacE",
          "name": "lens/thanksmadfi",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafkreigs2gh3yevtdx5gwy3ahysydhrygzdxhndgbbzruto2emftkwspqy",
          "followers": 796,
          "following": 3314,
          "lensScore": 9786,
          "posts": 25
      },
      {
          "id": "0x17E304789481d22933613D241A38d8c6Da78C1275",
          "name": "lens/minds",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafkreicyfcxmkpfkfiafcjbdqiqcvmkji5mwrj2hglkkuudnfv7hfk6oly",
          "followers": 1075,
          "following": 3876,
          "lensScore": 9786,
          "posts": 20
      },
      {
          "id": "0x18515f97c02CF1647Cd459C1c11737399D5Dc0Af6",
          "name": "lens/maxdalikamillakulova",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmbkG1r9JGjfMLiBWSBDgAgwxGCmiFXyNGgkgkrj2iMmkg",
          "followers": 2048,
          "following": 1777,
          "lensScore": 9728,
          "posts": 337
      },
      {
          "id": "0x1361dfd43519389ddd209B07411B61D536d2B4A88",
          "name": "lens/tum4y",
          "picture": "https://ik.imagekit.io/lens/14f3f1f83ffd7386406a2d21933b378a3df78dcb2c1a1422da73ff40c4142642_usPXnBVQl.webp",
          "followers": 1050,
          "following": 503,
          "lensScore": 9688,
          "posts": 2677
      },
      {
          "id": "0x1E91C1C65E07e473f558665E3C6D8789EeA43d99B",
          "name": "lens/pothead",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeigbhg2v463bu4iqdpj2hdb5jxdjmqwndc5snowjsizx6lwg65byyi",
          "followers": 839,
          "following": 579,
          "lensScore": 9664,
          "posts": 1250
      },
      {
          "id": "0x133fb50431Ad7E548b4616eE5F6FE990dbbCBf1eA",
          "name": "lens/blaubirds",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/58d612fd46e3d2e0138f1e332b1f0c74e0321ebd8dd69cee4f8c4cdd7cd01d7a.webp",
          "followers": 4238,
          "following": 131,
          "lensScore": 9575,
          "posts": 1346
      },
      {
          "id": "0x1f4E23AB731c72c3a4Ce19C0F0051b2863257B1F5",
          "name": "lens/elonmusk-x",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmbakM23RC8f8ppu28htM8RarXGNFH4mL5QC9WyJigiUi6",
          "followers": 1495,
          "following": 270,
          "lensScore": 9496,
          "posts": 3810
      },
      {
          "id": "0x14D7662ef16305b379e03D65194Ed3Bc1366BDa7A",
          "name": "lens/qola23",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeiaxoovrtphaun7odhu7gbjplkh25ythd3lg5ni4v2td2lwcfm3dhy",
          "followers": 79,
          "following": 180,
          "lensScore": 9403,
          "posts": 476
      },
      {
          "id": "0x1524F8BbC231e95CA1971460B889E1b54E3AF3372",
          "name": "lens/ahmedbahaa",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/f2ed2039dc14eb77d3825981a56e5acd5ee4a3a8628c6e9dbc23dcd675ef89ba.jpg",
          "followers": 29,
          "following": 79,
          "lensScore": 9315,
          "posts": 97
      },
      {
          "id": "0x176867Ec3916f7ddcD4Df9021b9321497260B6ea9",
          "name": "lens/maonx",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeibjvu3yqbmiq4fsbbbwwriqtkxkzqxvmz42o7umbbkk3i7hz4zema",
          "followers": 1334,
          "following": 726,
          "lensScore": 9312,
          "posts": 319
      },
      {
          "id": "0x15E0Cbc2125a651bDd8B468238A80416B5e02a782",
          "name": "lens/trippin36",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafkreiard65cg67nzltdoonuef32gtpoe4xnk4vlv5rbklvprhtqxohjze",
          "followers": 23,
          "following": 286,
          "lensScore": 9311,
          "posts": 88
      },
      {
          "id": "0x175f54916179471Be38441BbD0eF3b8a9b6d473eB",
          "name": "lens/qinjiangban",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafkreigclxkyvd5mc6hrtzzfwzfjy2k7kirnewkoiyqe3qxtco6556aqva",
          "followers": 8,
          "following": 55,
          "lensScore": 9207,
          "posts": 90
      },
      {
          "id": "0x1F5852B0c02324dEbcd7182Ea309B4ac6c1098E34",
          "name": "lens/echo2",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeialg23wynjm6baxdrjy5bldgskdxffrgdhqjs7m6erp7rtgqqhquq",
          "followers": 36,
          "following": 533,
          "lensScore": 9200,
          "posts": 320
      },
      {
          "id": "0x1612e675Ac290d84aed7f1606CE570877217F071e",
          "name": "lens/luma55",
          "picture": "https://ik.imagekit.io/lens/47de33a8f929cebb97990cca1b9ed96b9f68e9756f1a81c56e2a4387c9438d47_nGskBys9U.webp",
          "followers": 9,
          "following": 19,
          "lensScore": 9186,
          "posts": 45
      },
      {
          "id": "0x1a50CaC42927EbE85E6189363cB9bA6f3753A26eb",
          "name": "lens/gabagool_",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/1b8b813f91169a97f818839054e0b0feb370cb8eba2eddeebdecd69d2ca71cf2.jpg",
          "followers": 24,
          "following": 122,
          "lensScore": 9153,
          "posts": 35
      },
      {
          "id": "0x1A767f511deea5E418Fb5745b14d350Cb01aA1380",
          "name": "lens/abdulkabir001",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafkreib6wkexe4bjhiezd27gviepwcmv2ffz4ub4yiahtm5z7fsoi5qcvu",
          "followers": 1,
          "following": 13,
          "lensScore": 9135,
          "posts": 1
      },
      {
          "id": "0x157e84d7e278835DF2EfDdb2d22f64A6c33eeDD97",
          "name": "lens/chickenjowent",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeiafxc35cmgfz4qsc6nh6s47euqb5rpmuf5cvszrnu3zqojify36ce",
          "followers": 30,
          "following": 112,
          "lensScore": 9095,
          "posts": 60
      },
      {
          "id": "0x1A44497E33380165d062bb1aA20D05d1F0b88E30C",
          "name": "lens/alpertiryaki",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmbMBapc1uNnRNv6YzNSY6jXdjJ9givNJ8BySfg2pvKVXW",
          "followers": 1300,
          "following": 402,
          "lensScore": 9045,
          "posts": 924
      },
      {
          "id": "0x1fE4FA94abAF9dfd0611ab166eaA95d552C562aD0",
          "name": "lens/ens01",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeifj7gjoocbutaezjdzosnc2ey5aztyw7migzahoqpfq3rsp3poklq",
          "followers": 1708,
          "following": 850,
          "lensScore": 9015,
          "posts": 709
      },
      {
          "id": "0x1651fe6E049005C351B9C7477280542DcF4eCcb5e",
          "name": "lens/swethapd",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/8a5accae0fdd3cbc0a79901d1495f57485f51dfa529b7dbbe089be7e4f29b8b7.webp",
          "followers": 11,
          "following": 3,
          "lensScore": 8959,
          "posts": 0
      },
      {
          "id": "0x1FAB7873B905Ea20322Ca590270c1451F9A4ab570",
          "name": "lens/thenextzth",
          "picture": "https://ik.imagekit.io/lens/e5cb52a10ae8fd1f9299091033c4def0e1cf44d05a95fac9ddfc32a81848da04_nNbZEJLo-.png",
          "followers": 12,
          "following": 170,
          "lensScore": 8889,
          "posts": 102
      },
      {
          "id": "0x1d9DFb7A0F64Cd1854AFDce07971C027af1719A41",
          "name": "lens/mmdreykid",
          "picture": "https://ik.imagekit.io/lens/27b999bc0607c62e231dd8bbaefa372f2c2d31ebca9f69261c3bbcb18db3e56b_uM5uwXxAO.png",
          "followers": 12,
          "following": 73,
          "lensScore": 8801,
          "posts": 28
      },
      {
          "id": "0x19A4999Ee46022eeEC0f1e9414b849cff7d53a293",
          "name": "lens/sanz14",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/e734ed115931734b57fbf82a1739dc6d132d16942fe6064752bfc5c554a2d117.webp",
          "followers": 271,
          "following": 1832,
          "lensScore": 8724,
          "posts": 118
      },
      {
          "id": "0x1563cb6BcC16549B641b1Cf915c23F4D013fa6b51",
          "name": "lens/0xqedk",
          "picture": "https://ik.imagekit.io/lens/17278018cb141149300e7a3078fed945fd6ed5c64d5957e4879e3e53026e67a2_WK0diyUTqr.png",
          "followers": 42,
          "following": 14,
          "lensScore": 8447,
          "posts": 23
      },
      {
          "id": "0x1b759dC18f6b771587e4135A1ad68A6091ea4B4F9",
          "name": "lens/mamskyy",
          "picture": "https://ik.imagekit.io/lens/e687c4d1403262d900fa7643af9041df0a86bf0983ac13fba6e753ee217cad3c_ceUCMoCte.png",
          "followers": 0,
          "following": 56,
          "lensScore": 8425,
          "posts": 27
      },
      {
          "id": "0x15BCF9a06eC4A0BF26320A6aAB7392b5c846CA745",
          "name": "lens/arishaafroj",
          "picture": "https://ik.imagekit.io/lens/1fb92e4a6997b85d2790f38528d6c7ac635cb8ac0df16f3ddf516b207ab3eacd_AjuoJN5VVD.webp",
          "followers": 2,
          "following": 18,
          "lensScore": 8339,
          "posts": 65
      },
      {
          "id": "0x11CcC08919a442244C10b5C51D7AE0e63E33A45fC",
          "name": "lens/kumi_eth",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/eea290bcf3f27141b174ecee4c7e2dccddd0ce52d1cc4af32a29fffe0e08726a.jpg",
          "followers": 1,
          "following": 263,
          "lensScore": 8150,
          "posts": 13
      },
      {
          "id": "0x17E934E0277cf623E9022d9EaB81559359496C49b",
          "name": "lens/bereket",
          "picture": "https://ik.imagekit.io/lens/549071259084402b483c67e66040f48e101a12e66213e03873a4c746ec92ad80_rGk4Spl4r.webp",
          "followers": 226,
          "following": 827,
          "lensScore": 8062,
          "posts": 67
      },
      {
          "id": "0x1555344185CF7b9aAbF8b51164714e8560B492aF0",
          "name": "lens/thekhryzyang",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/e2386743e66b8e767d6729ca7f63e55374c920f6c2717d5e6a74ea72e3d00f87.png",
          "followers": 29,
          "following": 31,
          "lensScore": 8060,
          "posts": 22
      },
      {
          "id": "0x1edfCd7ec8E0B68B9CdbD3Ad6A5104A44338f526F",
          "name": "lens/zulycuong",
          "picture": "https://ik.imagekit.io/lens/f888a2c467aaf6a9d374b125e33df6b4b873032588a8194c13603bfbbe750ee4_e0-8R-NbW.png",
          "followers": 3528,
          "following": 3944,
          "lensScore": 8045,
          "posts": 811
      },
      {
          "id": "0x14e5319DEd122c621264e6BBe843a5617A15c49DD",
          "name": "lens/nekiichel",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeia57sucjhzkinhv5tcp3utn6mg5rrye3bru3sww45frvt6dgmxbvq",
          "followers": 202,
          "following": 394,
          "lensScore": 8040,
          "posts": 228
      },
      {
          "id": "0x1F1A0E4c5753514dA246bC3d9e3F7d0203556540D",
          "name": "lens/tannu",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeic5t2jcit3atmcxznye4upfn7isjlerrlxdwtg3vujjdqg33b6btq",
          "followers": 704,
          "following": 3295,
          "lensScore": 7918,
          "posts": 129
      },
      {
          "id": "0x19DD5cd2124F5ae1D39C4E740b81Eff19030FA650",
          "name": "lens/gobbvv",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/64c085f2bc4bb54feef6b5e6201eacb9c4680b557505d8e2e31c7526dad0f594.jpg",
          "followers": 5,
          "following": 35,
          "lensScore": 7898,
          "posts": 24
      },
      {
          "id": "0x1CA8EF8cD0fdDC303B535C5538668B18A720Be20A",
          "name": "lens/lolad",
          "picture": "https://ik.imagekit.io/lens/41898d5d47232cec91e301b281099d53a8186ba6d87dd8d513395cc9ef9e594a_vQOx3NjGu.jpeg",
          "followers": 648,
          "following": 444,
          "lensScore": 7891,
          "posts": 958
      },
      {
          "id": "0x1A9c49252d844323fc7FA6c2308eC6AFF5B8b1a05",
          "name": "lens/fguejh",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/ae919ce7a0467c42210b67bd18587ac8e279f131d8bd89e4cc3a99a7d13775d4.webp",
          "followers": 8,
          "following": 11,
          "lensScore": 7889,
          "posts": 21
      },
      {
          "id": "0x112A344058d691486E5CA6e615B111650361aC186",
          "name": "lens/nini1",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeicxtipmy3o4z7g5mnui4ftycwisazphpujw6fl7ygz27doo4lzw5m",
          "followers": 32,
          "following": 555,
          "lensScore": 7880,
          "posts": 316
      },
      {
          "id": "0x13BCd3B01ED200C48665a1Ca7868AA2CC5D7f22B2",
          "name": "lens/cryptovolksid",
          "picture": "https://ik.imagekit.io/lens/bd30bbf7b75495568754437063622950334ca2b3d5fa1df62ac467dc8b00ca77_yO-tAfd7Zw.webp",
          "followers": 0,
          "following": 74,
          "lensScore": 7849,
          "posts": 8
      },
      {
          "id": "0x1Ad3f2Da08daFCdfD318A70A27Da8F3546513f9FC",
          "name": "lens/fakewhoever",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/4913065fc316a911d3a0d7314f635894112e20075cece23c93874d94350b22f2.webp",
          "followers": 721,
          "following": 571,
          "lensScore": 7822,
          "posts": 57
      },
      {
          "id": "0x19b80F935Ddea73BF67676db0d82034Cc7A2FbEe9",
          "name": "lens/ankhzog",
          "picture": "https://ik.imagekit.io/lens/a83a99675fba4afd4b8aa16353123394f512ed57735c51d49a36c66642a0687e_3RQsH3j7E.webp",
          "followers": 17,
          "following": 66,
          "lensScore": 7805,
          "posts": 97
      },
      {
          "id": "0x12A36108c5D0bb30b96973F708130aFE7d15d9C71",
          "name": "lens/predaking",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafkreiht6ojc32rlehjhpsjirxm27r47hdynmtlyoczjwgly546w2sbcea",
          "followers": 2,
          "following": 19,
          "lensScore": 7804,
          "posts": 94
      },
      {
          "id": "0x1395F5894447DEb112B547Bb6d9fb0dd9d5e97916",
          "name": "lens/amiyk",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/ee369fcc78fec98503556ec38f5e1eeb94325b06e0dd0b707d7504643b461844.webp",
          "followers": 1,
          "following": 17,
          "lensScore": 7693,
          "posts": 12
      },
      {
          "id": "0x123f49B503686b69528B294F834AF8353b8cb309E",
          "name": "lens/co_achievers",
          "picture": "https://ik.imagekit.io/lens/ba68eb2b7d2c5b13c36d70986ce09d23efc775ff9433c105922b5078d0d25bcd_zO9-UgVQ0.webp",
          "followers": 344,
          "following": 342,
          "lensScore": 7575,
          "posts": 320
      },
      {
          "id": "0x149c4f79C399d7e47C843023819BAD9aE6111336F",
          "name": "lens/headshot",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/4bf559f581bb2b96bdfc4cbff5b4e34732901e48930c3adaa00f10b940d94f34.webp",
          "followers": 2180,
          "following": 1069,
          "lensScore": 7574,
          "posts": 693
      },
      {
          "id": "0x1b7428a3ddf6cB3E84fa0E9730fC334718f9EC1d6",
          "name": "lens/glags",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafkreiaeduvwcv5zdgzc7fji7h4xw4ikpe6qgvy75fiqibe3i3kbl4w74y",
          "followers": 309,
          "following": 1017,
          "lensScore": 7573,
          "posts": 308
      },
      {
          "id": "0x1B6ab9cDcf57E874435A416c0f41527FDb3578005",
          "name": "lens/g0rila",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafkreihz6bpxetgswoabsxkpbspd53rdvmg56fcvbcurzwq63zlcvtf3ce",
          "followers": 9,
          "following": 15,
          "lensScore": 7568,
          "posts": 10
      },
      {
          "id": "0x17709035b62f83aFD3645E0C6f988E5EF702078cA",
          "name": "lens/fsfafs",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/501710dba2b178c1215b6793a0cead576f6f69823dd1e9d9458cc4c1742a5cdd.webp",
          "followers": 2,
          "following": 251,
          "lensScore": 7501,
          "posts": 21
      },
      {
          "id": "0x18e36a5a2F4771FD0B14200aCE3d6f25c2892756a",
          "name": "lens/35nikey",
          "picture": "https://ik.imagekit.io/lens/292899e134818a88a7fc87cf4f444342b8274a1ec98ab77f3ba39bca26da0ca8_4B7bareD0.png",
          "followers": 19,
          "following": 286,
          "lensScore": 7484,
          "posts": 343
      },
      {
          "id": "0x1C84b990994b7442719c8Ca8Fb6bf6748ad9FB294",
          "name": "lens/nodeone",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmYgjZG6Fb3WWYayoE7LpFfXoEhUKFYEQ1jrk3k5H5GJDu",
          "followers": 526,
          "following": 4811,
          "lensScore": 7395,
          "posts": 353
      },
      {
          "id": "0x1ced4c837F9b548D8A2ed7e596bf513c4BB626e2E",
          "name": "lens/tauquir",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeiekxe7i3ub73xsdfwrnezhvo7bewkjegbdqbrghp242hop2y7pmza",
          "followers": 4,
          "following": 43,
          "lensScore": 7384,
          "posts": 25
      },
      {
          "id": "0x1C8994FbeA27B385DDc95CEDe6657F9F94EC33c26",
          "name": "lens/cryptoride",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafkreigmuavcvruymqmza3mjsmdjs3wfcgvtbxv6cpqql76yjm3gh6riyu",
          "followers": 9,
          "following": 103,
          "lensScore": 7297,
          "posts": 66
      },
      {
          "id": "0x133900C68f4d189c892f779C4044849C191273BCE",
          "name": "lens/jejedjjd",
          "picture": "https://ik.imagekit.io/lens/06e3b0ebc50626da0e2d27945a1da49145890858b3a4c8b8402b8bb72b0369ba__J8gWdvad.png",
          "followers": 4,
          "following": 7,
          "lensScore": 7254,
          "posts": 14
      },
      {
          "id": "0x1C155B86D99b499c0c1eB9DCb74E88E22d22fEf2d",
          "name": "lens/sixframes",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/a17778ef9dbc3cd2cabd123444f1ad808fd07bf9949ba4fe65a46cb9f32c3c51.webp",
          "followers": 20,
          "following": 30,
          "lensScore": 7240,
          "posts": 8
      },
      {
          "id": "0x144Cc2d257B8B48B1f6C8aDa70c181faCcB9f253E",
          "name": "lens/dutashampoolain",
          "picture": "https://ik.imagekit.io/lens/ec1de652c8a04c6f7fae8d9de1abd69db601d38b1dc7fe9710cee8b9e529893f_k_OQgNpwg.png",
          "followers": 1,
          "following": 40,
          "lensScore": 7136,
          "posts": 13
      },
      {
          "id": "0x1C1d27C81ef72a829E9C8108Bbf063E18234eCCCC",
          "name": "lens/parvin528",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/693807538d020b1b405c9dcc455fd417fe20e485ff58a8c6b175db9ee0126308.jpg",
          "followers": 244,
          "following": 1661,
          "lensScore": 7114,
          "posts": 120
      },
      {
          "id": "0x119a3d947242a6374402A6F7dA8d97085415186f9",
          "name": "lens/0i933",
          "picture": "https://ik.imagekit.io/lens/f61c8daf2b589c2de0ceceeb32307d8a367cc4b607cfe8e800ae5822ab95df9a_d3lmtjZ0N-.png",
          "followers": 217,
          "following": 1276,
          "lensScore": 7035,
          "posts": 41
      },
      {
          "id": "0x1257187828F67A1B159290F14609a062f62C8F9cb",
          "name": "lens/ghunter",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmRiK3v7YMBp4GunzjgEr58n8W5VbZuEBt2br5SWd6bCW9",
          "followers": 177,
          "following": 156,
          "lensScore": 7019,
          "posts": 282
      },
      {
          "id": "0x1D27A251CCeF7Ba3Fd1A2fbAAA3DfbBdD9d299A39",
          "name": "lens/not_my_alt",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/f7b225c64c4247d17f04f9340252203885384c9c9610d0d022c7f9fd99cffbbf.webp",
          "followers": 3,
          "following": 22,
          "lensScore": 7015,
          "posts": 11
      },
      {
          "id": "0x1740BC340d1276807bf57909D5435f1a2F1C8B168",
          "name": "lens/guguzaza",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeifesbxuofdpsadoy652jbohgxtqujesb447cm24h4ouvpyr576lky",
          "followers": 122,
          "following": 634,
          "lensScore": 7006,
          "posts": 337
      },
      {
          "id": "0x1ddE7d639Fbd690b6E59b8F99D688087C934FEaCf",
          "name": "lens/dinomax",
          "picture": "https://gw.ipfs-lens.dev/ipfs/QmbQ5r8tvHNsbb928Rq1KACrjvLhLgLWuxwG2E4YqYXPS6",
          "followers": 19,
          "following": 45,
          "lensScore": 6957,
          "posts": 44
      },
      {
          "id": "0x15F9aC172d527d8e6609f8468754CD8b814396662",
          "name": "lens/martinez7874",
          "picture": "https://ik.imagekit.io/lens/media-snapshot/207b0d379f227f7b8bf537674a24e784fa4bc1de251c517a1c9d9db58ecf676a.webp",
          "followers": 1,
          "following": 10,
          "lensScore": 6924,
          "posts": 1
      },
      {
          "id": "0x116b014eCCBc53726e47807a2633c288919d7A57a",
          "name": "lens/joune",
          "picture": "https://gw.ipfs-lens.dev/ipfs/bafybeiegaqg3ftlh7warus3vn5djhfi5gidudkdrefq2lo7jpaezgsxhhe",
          "followers": 69,
          "following": 759,
          "lensScore": 6874,
          "posts": 14
      }
  ],
  "links": [
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xcd620a65cF58684d75c0D79768CE11acc9E5DC0c"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x8273B93d90F88F45Cb6D3070F78830b6fF1D1179"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x6BE7df3A693Dcc92EBdBf5C18191e3E429dD94d2"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x7FB38DD3907CfF25A26334bFA70412B6a23760BD"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x251fc41F401d23C4c199A3Cd8a4a8B30c6E28142"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x0478dDEEbB272Fdc4e33DFCC2dCA7263B02D7bd0"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x6D7366dF51E0fb9FF90DaE24534F9E223eb8d7bD"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xAd2c0BEAdE60fb9f7ec5C87bDE8e4c126145F6E7"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xE38f01cB7Ee044fb6FF0041D1ef666929e4cbc02"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xcD36E6276F64044c418afC159A0e3848B14B39cd"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x90c2f002bc1D50D08773C7b4ba5cfCFdB3Cfcb31"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x96374a53B87716f0577C5b4E31327a9E0A354a1b"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x51F9cb3CDd9434B1d56ed4d3291AF2CA0464feB0"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x76A8a97ec4A173Ff379B4020b6730c9C2ecEE02e"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x042C676E9c3564f3fbB74046d586Bf4d9049c481"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x07c2d0dbcC78AA6F77806E4a33bD89cb3d6625bb"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x8dF6b0847E7BbBEDF2641229c0AC6736A1121dE5"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x6eE00E41Cc3BCfDFd537b266025dB619D7cC3542"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x5151b163d43aA716D422f2a79CB9e4b1b254Ec7A"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xb6D756C8E745389AAE6C922C67D2aA3555aD93b3"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xE31565e104cC74e15B533D225EB97eF5246EF25d"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x1F1Ec2411891Bec63C2b3aa67681583c6B473f71"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x3726eeD5f7d2a970dbf49F8BA89eD3770dCdf0fF"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x38D671E40dBd93E2188F18BB646Dd9a579f1327c"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x3a3e69a77BAA6C50464A2ef2E41849E64372dafB"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xa9Dc4AE74365B91629eceC26cfF8F6a2705A36b3"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x72BEA315EA96C24af722216Eb2aC92AD05a8B702"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x910f7cA4a0b29D2b48E054Aa2e0e251Ec144b163"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x6CC874B0afdfcE22C08fF6aA89660843FC877c01"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x837Dcf1416d676c94a5759900203b0e55356D886"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xc287F548c2571D1ad66a52d3B4da93FAf612F13d"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x633Ecf099E1bb1C6ec04d8dC63Da74bAE7646CA9"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x32aC97E1069ba630578A344cC9BDd5559554Fe14"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x062D24760a12F83c4a5b4dc2b13be8fc39D00B2D"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x98310a7092E3c1CFbb62eAaDE8e894b941212dC9"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xbD93C6Ef8CC71FFe1aF17d2293d7DB8EC4C75a7d"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x2DD087F75D3E1A9e77bb3Fe9231deEdd4A191469"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xCfc670A7f42aa50cbC130D9a165F2359185b6A96"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x2580324365160Df43559e40D1a20861B7F6Cf5c6"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x34C52ee55E24094FBaFc02118d5C227C21F8BacE"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x7E304789481d22933613D241A38d8c6Da78C1275"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x8515f97c02CF1647Cd459C1c11737399D5Dc0Af6"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x361dfd43519389ddd209B07411B61D536d2B4A88"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xE91C1C65E07e473f558665E3C6D8789EeA43d99B"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x33fb50431Ad7E548b4616eE5F6FE990dbbCBf1eA"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xf4E23AB731c72c3a4Ce19C0F0051b2863257B1F5"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x4D7662ef16305b379e03D65194Ed3Bc1366BDa7A"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x524F8BbC231e95CA1971460B889E1b54E3AF3372"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x76867Ec3916f7ddcD4Df9021b9321497260B6ea9"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x5E0Cbc2125a651bDd8B468238A80416B5e02a782"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x75f54916179471Be38441BbD0eF3b8a9b6d473eB"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xF5852B0c02324dEbcd7182Ea309B4ac6c1098E34"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x612e675Ac290d84aed7f1606CE570877217F071e"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xa50CaC42927EbE85E6189363cB9bA6f3753A26eb"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xA767f511deea5E418Fb5745b14d350Cb01aA1380"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x57e84d7e278835DF2EfDdb2d22f64A6c33eeDD97"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xA44497E33380165d062bb1aA20D05d1F0b88E30C"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xfE4FA94abAF9dfd0611ab166eaA95d552C562aD0"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x651fe6E049005C351B9C7477280542DcF4eCcb5e"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xFAB7873B905Ea20322Ca590270c1451F9A4ab570"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xd9DFb7A0F64Cd1854AFDce07971C027af1719A41"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x9A4999Ee46022eeEC0f1e9414b849cff7d53a293"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x563cb6BcC16549B641b1Cf915c23F4D013fa6b51"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xb759dC18f6b771587e4135A1ad68A6091ea4B4F9"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x5BCF9a06eC4A0BF26320A6aAB7392b5c846CA745"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x1CcC08919a442244C10b5C51D7AE0e63E33A45fC"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x7E934E0277cf623E9022d9EaB81559359496C49b"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x555344185CF7b9aAbF8b51164714e8560B492aF0"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xedfCd7ec8E0B68B9CdbD3Ad6A5104A44338f526F"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x4e5319DEd122c621264e6BBe843a5617A15c49DD"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xF1A0E4c5753514dA246bC3d9e3F7d0203556540D"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x9DD5cd2124F5ae1D39C4E740b81Eff19030FA650"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xCA8EF8cD0fdDC303B535C5538668B18A720Be20A"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xA9c49252d844323fc7FA6c2308eC6AFF5B8b1a05"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x12A344058d691486E5CA6e615B111650361aC186"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x3BCd3B01ED200C48665a1Ca7868AA2CC5D7f22B2"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xAd3f2Da08daFCdfD318A70A27Da8F3546513f9FC"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x9b80F935Ddea73BF67676db0d82034Cc7A2FbEe9"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x2A36108c5D0bb30b96973F708130aFE7d15d9C71"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x395F5894447DEb112B547Bb6d9fb0dd9d5e97916"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x23f49B503686b69528B294F834AF8353b8cb309E"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x49c4f79C399d7e47C843023819BAD9aE6111336F"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xb7428a3ddf6cB3E84fa0E9730fC334718f9EC1d6"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xB6ab9cDcf57E874435A416c0f41527FDb3578005"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x7709035b62f83aFD3645E0C6f988E5EF702078cA"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x8e36a5a2F4771FD0B14200aCE3d6f25c2892756a"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xC84b990994b7442719c8Ca8Fb6bf6748ad9FB294"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xced4c837F9b548D8A2ed7e596bf513c4BB626e2E"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xC8994FbeA27B385DDc95CEDe6657F9F94EC33c26"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x33900C68f4d189c892f779C4044849C191273BCE"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xC155B86D99b499c0c1eB9DCb74E88E22d22fEf2d"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x44Cc2d257B8B48B1f6C8aDa70c181faCcB9f253E"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xC1d27C81ef72a829E9C8108Bbf063E18234eCCCC"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x19a3d947242a6374402A6F7dA8d97085415186f9"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x257187828F67A1B159290F14609a062f62C8F9cb"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xD27A251CCeF7Ba3Fd1A2fbAAA3DfbBdD9d299A39"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x740BC340d1276807bf57909D5435f1a2F1C8B168"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0xddE7d639Fbd690b6E59b8F99D688087C934FEaCf"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x5F9aC172d527d8e6609f8468754CD8b814396662"
      },
      {
          "source": "0xA8113f4198f8df6394b4283FB4787C4e250072B3",
          "target": "0x16b014eCCBc53726e47807a2633c288919d7A57a"
      }
  ]
}; 