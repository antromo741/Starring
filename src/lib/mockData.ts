import type { Row, Title } from "./types";
import { ORIGINALS } from "./originalsData";
import { STARRING } from "./starringData";

/**
 * Curated, self-contained dataset so the app looks great with zero setup.
 * Posters are rendered as generated gradients (no network needed). Drop a
 * TMDB_API_KEY into .env.local to swap in real artwork + trailers — see
 * src/lib/tmdb.ts.
 */

// A reliable, public-domain sample clip used by the in-app player in mock mode.
export const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const RATINGS = ["TV-MA", "TV-14", "PG-13", "R", "TV-PG", "PG"];

let _id = 1;

type Seed = {
  name: string;
  overview: string;
  year: number;
  genres: string[];
  /** Films get "1h 52m"; series get "N Seasons". */
  length: string;
  rating?: string;
};

function make(seed: Seed): Title {
  return {
    id: _id++,
    name: seed.name,
    overview: seed.overview,
    year: seed.year,
    rating: seed.rating ?? RATINGS[seed.name.length % RATINGS.length],
    matchPct: 80 + (seed.name.length * 7) % 20, // deterministic 80–99
    length: seed.length,
    genres: seed.genres,
    videoUrl: SAMPLE_VIDEO,
  };
}

const trending: Title[] = [
  make({ name: "Stranger Things", overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.", year: 2022, genres: ["Sci-Fi", "Horror", "Drama"], length: "4 Seasons" }),
  make({ name: "Wednesday", overview: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.", year: 2022, genres: ["Mystery", "Comedy", "Fantasy"], length: "1 Season" }),
  make({ name: "The Night Agent", overview: "While monitoring an emergency line, a low-level FBI agent answers a call that plunges him into a deadly conspiracy reaching the White House.", year: 2023, genres: ["Thriller", "Action"], length: "2 Seasons" }),
  make({ name: "Glass Onion", overview: "World-famous detective Benoit Blanc heads to Greece to peel back the layers of a mystery involving a new cast of colorful suspects.", year: 2022, genres: ["Mystery", "Comedy"], length: "2h 19m" }),
  make({ name: "Money Heist", overview: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.", year: 2021, genres: ["Crime", "Thriller"], length: "5 Seasons" }),
  make({ name: "The Witcher", overview: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.", year: 2023, genres: ["Fantasy", "Action", "Adventure"], length: "3 Seasons" }),
  make({ name: "Squid Game", overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize — with deadly high stakes.", year: 2021, genres: ["Thriller", "Drama"], length: "2 Seasons" }),
  make({ name: "Dark", overview: "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.", year: 2020, genres: ["Sci-Fi", "Mystery", "Thriller"], length: "3 Seasons" }),
  make({ name: "The Gray Man", overview: "When a shadowy CIA agent uncovers damning agency secrets, he's hunted across the globe by a sociopathic rogue operative who puts a bounty on his head.", year: 2022, genres: ["Action", "Thriller"], length: "2h 9m" }),
  make({ name: "Black Mirror", overview: "This sci-fi anthology series explores a twisted, high-tech near-future where humanity's greatest innovations and darkest instincts collide.", year: 2023, genres: ["Sci-Fi", "Drama"], length: "6 Seasons" }),
];

const originals: Title[] = [
  make({ name: "The Crown", overview: "This drama follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.", year: 2023, genres: ["Drama", "History"], length: "6 Seasons" }),
  make({ name: "Ozark", overview: "A financial adviser drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.", year: 2022, genres: ["Crime", "Drama", "Thriller"], length: "4 Seasons" }),
  make({ name: "Bridgerton", overview: "Wealth, lust, and betrayal set against the backdrop of Regency-era England, seen through the eyes of the powerful Bridgerton family.", year: 2023, genres: ["Drama", "Romance"], length: "3 Seasons" }),
  make({ name: "The Queen's Gambit", overview: "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction.", year: 2020, genres: ["Drama"], length: "1 Season" }),
  make({ name: "Narcos", overview: "The true story of Colombia's infamously violent and powerful drug cartels fuels this gritty gangster drama series.", year: 2021, genres: ["Crime", "Drama"], length: "3 Seasons" }),
  make({ name: "Mindhunter", overview: "In the late 1970s, two FBI agents expand criminal science by delving into the psychology of murder and getting uncomfortably close to all-too-real monsters.", year: 2019, genres: ["Crime", "Drama", "Thriller"], length: "2 Seasons" }),
  make({ name: "BoJack Horseman", overview: "Meet the most beloved sitcom horse of the '90s, 20 years later. He's a curmudgeon with a heart of... not quite gold, but maybe sterling.", year: 2020, genres: ["Animation", "Comedy", "Drama"], length: "6 Seasons" }),
  make({ name: "Sense8", overview: "Eight strangers across the globe find themselves mysteriously and intimately connected — and on the run from a man who wants them dead.", year: 2018, genres: ["Sci-Fi", "Drama"], length: "2 Seasons" }),
  make({ name: "The Umbrella Academy", overview: "Reunited by their father's death, estranged siblings with extraordinary powers uncover shocking family secrets — and a looming threat to humanity.", year: 2022, genres: ["Sci-Fi", "Action", "Comedy"], length: "4 Seasons" }),
  make({ name: "Lupin", overview: "Inspired by the adventures of Arsène Lupin, gentleman thief Assane Diop sets out to avenge his father for an injustice inflicted by a wealthy family.", year: 2023, genres: ["Crime", "Mystery", "Thriller"], length: "3 Seasons" }),
];

const popular: Title[] = [
  make({ name: "Breaking Bad", overview: "A high school chemistry teacher diagnosed with cancer teams with a former student to manufacture and sell methamphetamine to secure his family's future.", year: 2013, genres: ["Crime", "Drama", "Thriller"], length: "5 Seasons" }),
  make({ name: "Better Call Saul", overview: "The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his fateful run-in with Walter White and Jesse Pinkman.", year: 2022, genres: ["Crime", "Drama"], length: "6 Seasons" }),
  make({ name: "Peaky Blinders", overview: "A notorious gang in 1919 Birmingham, England, is led by the fierce Tommy Shelby, a crime boss set on moving up in the world no matter the cost.", year: 2022, genres: ["Crime", "Drama"], length: "6 Seasons" }),
  make({ name: "The Last Kingdom", overview: "As Alfred the Great defends his kingdom from Norse invaders, Uhtred — born a Saxon but raised by Vikings — seeks to claim his ancestral birthright.", year: 2022, genres: ["Action", "Drama", "History"], length: "5 Seasons" }),
  make({ name: "Vikings", overview: "The adventures of Ragnar Lothbrok, the greatest hero of his age, and his band of warriors and family as they raid and explore the world.", year: 2020, genres: ["Action", "Drama", "History"], length: "6 Seasons" }),
  make({ name: "Outer Banks", overview: "A tight-knit group of teens unearths a long-buried secret, setting off a chain of illicit events that takes them on an adventure they'll never forget.", year: 2023, genres: ["Action", "Drama", "Mystery"], length: "4 Seasons" }),
  make({ name: "You", overview: "A dangerously charming, intensely obsessive young man goes to extreme measures to insert himself into the lives of those he is fixated on.", year: 2023, genres: ["Crime", "Drama", "Thriller"], length: "4 Seasons" }),
  make({ name: "Cobra Kai", overview: "Decades after the 1984 All Valley Karate Tournament, a down-and-out Johnny Lawrence seeks redemption by reopening the Cobra Kai dojo.", year: 2022, genres: ["Action", "Comedy", "Drama"], length: "6 Seasons" }),
  make({ name: "Shadow and Bone", overview: "Dark forces conspire against orphan mapmaker Alina when she unleashes an extraordinary power that could change the fate of her war-torn world.", year: 2023, genres: ["Fantasy", "Adventure"], length: "2 Seasons" }),
  make({ name: "Sweet Tooth", overview: "On a perilous adventure across a post-apocalyptic world, a lovable boy who's half-human and half-deer searches for a new beginning.", year: 2022, genres: ["Adventure", "Drama", "Fantasy"], length: "3 Seasons" }),
];

const action: Title[] = [
  make({ name: "Extraction", overview: "A hardened mercenary's mission becomes a soul-searching race to survive when he's sent to rescue the kidnapped son of an imprisoned crime lord.", year: 2020, genres: ["Action", "Thriller"], length: "1h 56m" }),
  make({ name: "Red Notice", overview: "An Interpol agent tracks the world's most wanted art thief — and reluctantly teams with a rival to catch an even more elusive criminal.", year: 2021, genres: ["Action", "Comedy", "Crime"], length: "1h 58m" }),
  make({ name: "6 Underground", overview: "After faking his death, a tech billionaire recruits a team of skilled operatives to take down notorious criminals in this high-octane thriller.", year: 2019, genres: ["Action", "Thriller"], length: "2h 8m" }),
  make({ name: "The Old Guard", overview: "Four undying warriors who've secretly protected humanity for centuries become the targets of a sinister plot to capture their power.", year: 2020, genres: ["Action", "Fantasy"], length: "2h 5m" }),
  make({ name: "Triple Frontier", overview: "Loyalties are tested when five former special forces operatives reunite for a high-stakes heist in the dense jungles of South America.", year: 2019, genres: ["Action", "Crime", "Thriller"], length: "2h 5m" }),
  make({ name: "Army of the Dead", overview: "After a zombie outbreak in Las Vegas, a group of mercenaries takes the ultimate gamble by venturing into the quarantine zone for the heist of a lifetime.", year: 2021, genres: ["Action", "Horror"], length: "2h 28m" }),
  make({ name: "Spenser Confidential", overview: "An ex-cop and boxer teams up with an aspiring fighter to expose corruption and unravel a conspiracy connected to the deaths of two officers.", year: 2020, genres: ["Action", "Comedy", "Crime"], length: "1h 51m" }),
  make({ name: "Project Power", overview: "On the streets of New Orleans, word breaks out of a mysterious new pill that unlocks superpowers — for exactly five unpredictable minutes.", year: 2020, genres: ["Action", "Sci-Fi"], length: "1h 53m" }),
  make({ name: "Outside the Wire", overview: "In the near future, a drone pilot is sent into a war zone and finds himself working for an android officer on a mission to stop a nuclear attack.", year: 2021, genres: ["Action", "Sci-Fi"], length: "1h 54m" }),
  make({ name: "Kate", overview: "Slipped a fatal dose of poison on her final job, a ruthless assassin has less than 24 hours to exact revenge on her enemies in neon-lit Tokyo.", year: 2021, genres: ["Action", "Thriller"], length: "1h 46m" }),
];

const comedies: Title[] = [
  make({ name: "The Good Place", overview: "Due to an error, self-absorbed Eleanor arrives in the afterlife's Good Place and tries to hide her past to keep her undeserved spot in paradise.", year: 2020, genres: ["Comedy", "Fantasy"], length: "4 Seasons" }),
  make({ name: "Brooklyn Nine-Nine", overview: "A talented but immature detective and his diverse, eccentric squad navigate the everyday absurdities of a New York City police precinct.", year: 2021, genres: ["Comedy", "Crime"], length: "8 Seasons" }),
  make({ name: "Arrested Development", overview: "Michael Bluth takes over the family business — and tries to keep his wildly dysfunctional and entitled relatives from running it into the ground.", year: 2019, genres: ["Comedy"], length: "5 Seasons" }),
  make({ name: "Schitt's Creek", overview: "When a wealthy couple suddenly loses their fortune, the pampered family is forced to rebuild their lives in the small town they once bought as a joke.", year: 2020, genres: ["Comedy"], length: "6 Seasons" }),
  make({ name: "Murder Mystery", overview: "A New York cop and his wife finally go on a long-promised European trip — only to be framed for the death of an elderly billionaire aboard a yacht.", year: 2019, genres: ["Comedy", "Crime", "Mystery"], length: "1h 37m" }),
  make({ name: "The Mitchells vs. the Machines", overview: "A quirky, dysfunctional family's road trip is upended when they find themselves as humanity's unlikeliest last hope during a robot uprising.", year: 2021, genres: ["Animation", "Comedy", "Adventure"], length: "1h 53m" }),
  make({ name: "Don't Look Up", overview: "Two astronomers go on a media tour to warn humankind of a planet-killing comet hurtling toward Earth — and meet a stunningly indifferent response.", year: 2021, genres: ["Comedy", "Drama", "Sci-Fi"], length: "2h 18m" }),
  make({ name: "The Hangover", overview: "Three friends wake up from a bachelor party in Las Vegas with no memory of the previous night — and the groom-to-be nowhere to be found.", year: 2009, genres: ["Comedy"], length: "1h 40m" }),
  make({ name: "Game Night", overview: "A group of friends' weekly game night turns into a real-life whodunit when one couple's competitive host stages a fake kidnapping that goes very wrong.", year: 2018, genres: ["Comedy", "Crime", "Mystery"], length: "1h 40m" }),
  make({ name: "Always Be My Maybe", overview: "Reconnecting after 15 years, two childhood friends — now a celebrity chef and an air conditioner installer — wonder if they're a perfect match.", year: 2019, genres: ["Comedy", "Romance"], length: "1h 41m" }),
];

const scifi: Title[] = [
  make({ name: "The Adam Project", overview: "After accidentally crash-landing in 2022, a time-traveling pilot teams up with his 12-year-old self for a mission to save the future.", year: 2022, genres: ["Sci-Fi", "Action", "Adventure"], length: "1h 46m" }),
  make({ name: "Bird Box", overview: "Five years after a mysterious force decimates the population, a mother and her two children make a desperate bid to reach safety — blindfolded.", year: 2018, genres: ["Sci-Fi", "Horror", "Thriller"], length: "2h 4m" }),
  make({ name: "The Cloverfield Paradox", overview: "Orbiting a planet on the brink of war, scientists test a device to solve an energy crisis — and end up face-to-face with a dark alternate reality.", year: 2018, genres: ["Sci-Fi", "Horror", "Mystery"], length: "1h 42m" }),
  make({ name: "Spiderhead", overview: "In a state-of-the-art penitentiary, inmates volunteer as subjects for mind-altering drugs in exchange for shorter sentences — until things spiral.", year: 2022, genres: ["Sci-Fi", "Thriller"], length: "1h 47m" }),
  make({ name: "Stowaway", overview: "A three-person crew on a mission to Mars faces an impossible choice when an unplanned passenger jeopardizes the lives of everyone on board.", year: 2021, genres: ["Sci-Fi", "Drama", "Thriller"], length: "1h 56m" }),
  make({ name: "I Am Mother", overview: "After humanity's extinction, a teenage girl is raised by a robot designed to repopulate the Earth — until a wounded stranger shatters her worldview.", year: 2019, genres: ["Sci-Fi", "Thriller"], length: "1h 53m" }),
  make({ name: "Tau", overview: "A woman held captive by a brilliant inventor must outwit an advanced AI named Tau in order to escape the high-tech smart house that imprisons her.", year: 2018, genres: ["Sci-Fi", "Thriller"], length: "1h 37m" }),
  make({ name: "Awake", overview: "After a global event wipes out electronics and the ability to sleep, a former soldier searches for a cure to save her daughter — and humanity.", year: 2021, genres: ["Sci-Fi", "Thriller"], length: "1h 36m" }),
  make({ name: "The Silent Sea", overview: "During a perilous 24-hour mission on the moon, elite space explorers try to retrieve mysterious samples from an abandoned research facility.", year: 2021, genres: ["Sci-Fi", "Mystery", "Drama"], length: "1 Season" }),
  make({ name: "Nightflyers", overview: "A team of scientists embarks on a daring expedition aboard a spaceship to make first contact with alien life — and faces a growing terror within.", year: 2018, genres: ["Sci-Fi", "Horror"], length: "1 Season" }),
];

const acclaimed: Title[] = [
  make({ name: "The Irishman", overview: "Hit man Frank Sheeran looks back at the secrets he kept as a loyal member of the Bufalino crime family in this sweeping epic from Martin Scorsese.", year: 2019, genres: ["Crime", "Drama"], length: "3h 29m", rating: "R" }),
  make({ name: "Marriage Story", overview: "A stage director and his actor wife struggle through a grueling, coast-to-coast divorce that pushes them to their personal and creative extremes.", year: 2019, genres: ["Drama", "Romance"], length: "2h 17m", rating: "R" }),
  make({ name: "Roma", overview: "A year in the life of a middle-class family's maid in Mexico City in the early 1970s, beautifully chronicled by director Alfonso Cuarón.", year: 2018, genres: ["Drama"], length: "2h 15m", rating: "R" }),
  make({ name: "The Power of the Dog", overview: "A domineering rancher responds with mocking cruelty when his brother brings home a new wife and her son — until the unexpected comes to pass.", year: 2021, genres: ["Drama", "Western"], length: "2h 6m", rating: "R" }),
  make({ name: "All Quiet on the Western Front", overview: "A young German soldier's idealism is shattered by the unimaginable horrors of trench warfare during the final days of World War I.", year: 2022, genres: ["Drama", "War"], length: "2h 28m", rating: "R" }),
  make({ name: "Mank", overview: "1930s Hollywood is reevaluated through the eyes of acerbic social critic and screenwriter Herman J. Mankiewicz as he races to finish 'Citizen Kane.'", year: 2020, genres: ["Drama", "History"], length: "2h 11m", rating: "R" }),
  make({ name: "The Trial of the Chicago 7", overview: "What was meant to be a peaceful protest at the 1968 Democratic Convention turned into a violent clash — and one of history's most notorious trials.", year: 2020, genres: ["Drama", "History"], length: "2h 9m", rating: "R" }),
  make({ name: "Pieces of a Woman", overview: "When a young mother's home birth ends in unfathomable tragedy, she begins a year-long odyssey of mourning that fractures relationships with everyone she loves.", year: 2020, genres: ["Drama"], length: "2h 6m", rating: "R" }),
  make({ name: "The Two Popes", overview: "Frustrated with the direction of the church, Cardinal Bergoglio requests permission to retire — and instead finds an unlikely friendship with Pope Benedict.", year: 2019, genres: ["Drama", "History"], length: "2h 5m", rating: "PG-13" }),
  make({ name: "Klaus", overview: "A selfish postman and a reclusive toymaker form an unlikely friendship that brings warmth — and the legend of Santa Claus — to a frozen, feuding town.", year: 2019, genres: ["Animation", "Comedy", "Family"], length: "1h 36m", rating: "PG" }),
];

const documentaries: Title[] = [
  make({ name: "Our Planet", overview: "Experience our planet's natural beauty and examine how climate change impacts all living creatures in this ambitious documentary of spectacular scope.", year: 2019, genres: ["Documentary"], length: "1 Season", rating: "TV-PG" }),
  make({ name: "The Social Dilemma", overview: "This documentary-drama hybrid explores the dangerous human impact of social networking, with tech experts sounding the alarm on their own creations.", year: 2020, genres: ["Documentary"], length: "1h 34m", rating: "PG-13" }),
  make({ name: "My Octopus Teacher", overview: "A filmmaker forges an unusual friendship with an octopus living in a South African kelp forest, learning as the curious creature shares the mysteries of her world.", year: 2020, genres: ["Documentary"], length: "1h 25m", rating: "TV-G" }),
  make({ name: "Formula 1: Drive to Survive", overview: "Go beyond the track as cameras follow the drivers and teams battling it out across a high-stakes, high-speed season of Formula 1 racing.", year: 2023, genres: ["Documentary", "Sport"], length: "6 Seasons", rating: "TV-MA" }),
  make({ name: "Making a Murderer", overview: "Exonerated after 18 years of wrongful imprisonment, Steven Avery files suit against those involved — and soon finds himself the prime suspect in a grisly new crime.", year: 2018, genres: ["Documentary", "Crime"], length: "2 Seasons", rating: "TV-14" }),
  make({ name: "Tiger King", overview: "A rivalry between big cat eccentrics takes a dark turn when Joe Exotic, a controversial animal park boss, is caught in a murder-for-hire plot.", year: 2020, genres: ["Documentary", "Crime"], length: "2 Seasons", rating: "TV-MA" }),
  make({ name: "Won't You Be My Neighbor?", overview: "An intimate look at America's favorite neighbor, Fred Rogers, and the legacy of kindness he left through decades of children's television.", year: 2018, genres: ["Documentary"], length: "1h 34m", rating: "PG-13" }),
  make({ name: "13th", overview: "Scholars, activists and politicians analyze the criminalization of African Americans and the U.S. prison boom in this powerful documentary.", year: 2016, genres: ["Documentary"], length: "1h 40m", rating: "TV-MA" }),
  make({ name: "Seaspiracy", overview: "Passionate about ocean life, a filmmaker sets out to document the harm that humans do to marine species — and uncovers alarming global corruption.", year: 2021, genres: ["Documentary"], length: "1h 29m", rating: "TV-14" }),
  make({ name: "The Last Dance", overview: "Charting the rise of the 1990s Chicago Bulls, this docuseries offers a tantalizing, never-before-seen look at the dynasty led by Michael Jordan.", year: 2020, genres: ["Documentary", "Sport"], length: "1 Season", rating: "TV-MA" }),
];

export const HOME_ROWS: Row[] = [
  { id: "starring-you", title: "Starring Anthony Roma", featured: true, items: STARRING },
  { id: "only-on-netflix", title: "Only on Netflix", featured: true, items: ORIGINALS },
  { id: "trending", title: "Trending Now", items: trending },
  { id: "originals", title: "Netflix Originals", featured: true, items: originals },
  { id: "popular", title: "Popular on Netflix", items: popular },
  { id: "action", title: "Action & Adventure", items: action },
  { id: "comedies", title: "Comedies", items: comedies },
  { id: "scifi", title: "Sci-Fi & Fantasy", items: scifi },
  { id: "acclaimed", title: "Critically Acclaimed Films", items: acclaimed },
  { id: "documentaries", title: "Documentaries", items: documentaries },
];

// The big billboard at the top of the page — you, the star.
export const HERO_TITLE: Title =
  STARRING.find((t) => t.name === "Redbeard") ?? STARRING[0];
