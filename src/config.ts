type Pixel = number;
type Degree = number;
type ScreenRelative = number;
type SizeRelative = number;

export const MAX_FPS = 30;
export const NODE_FORCE_FIELD_SIZE: SizeRelative = 1.5;
export const BORDER_FORCE_FIELD_SIZE: SizeRelative = 0.5;
export const MOVE_SLOW_RATIO = 1.25;
export const BALLOON_COUNT = 30;
export const BALLOON_MIN_SIZE: Pixel = 25;
export const BALLOON_MAX_SIZE: Pixel = 75;
export const BALLOON_MIN_SPEED: ScreenRelative = 0.2;
export const BALLOON_MAX_SPEED: ScreenRelative = 0.6;
export const BLOOD_POINT_SPACING: ScreenRelative = 0.025;
export const BLOOD_RANDOM_Y_OFFSET: ScreenRelative = 0.1;
export const BLOOD_MINIMUM_SPEED: ScreenRelative = 0.1;
export const BLOOD_MAXIMUM_SPEED: ScreenRelative = 0.2;
export const JIGSAW_PIECE_SIZE: Pixel = 50;
export const JIGSAW_HOLE_SIZE: Pixel = 10;
export const CONFETTI_COLORS = ['red', 'white', 'blue', 'orange', 'green'];
export const CONFETTI_COUNT = 1000;
export const CONFETTI_MAX_ROTATION_SPEED: Degree = 720;
export const CONFETTI_MIN_ROTATION_SPEED: Degree = 360;
export const CONFETTI_MAX_SPEED: ScreenRelative = 1.25;
export const CONFETTI_MIN_SPEED: ScreenRelative = 0.3;
export const CONFETTI_GRAVITY: ScreenRelative = 0.01;
export const CONFETTI_MAX_LENGTH: Pixel = 20;
export const CONFETTI_MIN_LENGTH: Pixel = 5;
export const CONFETTI_MAX_THICKNESS: Pixel = 8;
export const CONFETTI_MIN_THICKNESS: Pixel = 4;

export const WIKI_ARTICLES = {
	curated: {
		en: [
			"Bamse", "Snoopy", "Asterix (character)", "Goku", "Tintin (character)", //Cartoons
			"Saturn", "International Space Station", "Hubble Space Telescope", "Milky Way", "Comet", //Space
			"Charlie Chaplin", "Laurel and Hardy", "Mr. Bean (character)", "Abbott and Costello", "Benny Hill", //Slapstick
			"Jesus", "Moses", "Muhammad", "The Buddha", "L. Ron Hubbard", //Religion
			"Foot", "Tail", "Eye", "Beak", "Heart", //Body parts
			"Red panda", "Platypus", "Hammerhead shark", "Meerkat", "Rabbit", //Animals
			"Telephone", "Wheel", "Steam engine", "Computer", "Tesla coil", //Inventions
			"Ruby", "Diamond", "Aquamarine (gem)", "Sapphire", "Emerald", //Gemstones
			"Al Capone", "Edmund Kemper", "Charles Manson", "Christer Pettersson", "Pablo Escobar", //Criminals
			"Mathematics", "Physics", "Astronomy", "Chemistry", "Language", //School subjects
			"Floorball", "Karate", "Rallying", "Cricket", "American football", //Sports
			"Europe", "Asia", "Africa", "North America", "Australia", //Continents
			"Midas", "Carl XVI Gustaf", "Louis XVI", "Henry VIII", "Ramesses II", //Kings
			"Three Laws of Robotics", "Moore's law", "Newton's laws of motion", "Destiny", "Murphy's law", //Not really laws
			"Scarlett Johansson", "Izabella Scorupco", "Marilyn Monroe", "Judi Dench", "Michelle Yeoh", //Actresses
			"Lego", "Coca-Cola", "Adidas", "Samsung", "IKEA", //Brands
			"Nixie (folklore)", "Chupacabra", "Bigfoot", "Unicorn", "Leprechaun", //Folklore
			"Boten Anna", "I'm Gonna Be (500 Miles)", "Nothing Else Matters", "Gangnam Style", "What a Wonderful World", //Singles
			"Uluru", "Mount Fuji", "Grand Canyon", "Skogskyrkogården", "Victoria Falls", //Nature
			"Aftonbladet", "YouTube", "BBC", "Fox News", "Snapchat", //Online media
			"Battle of Poltava", "Battle of Gettysburg", "Normandy landings", "Battle of Hastings", "Siege of Baghdad", //Battles
			"Plumber", "Mechanic", "Chef", "Aircraft pilot", "Programmer", //Professions
			"Sock", "Raincoat", "Sandal", "Sombrero", "Kimono", //Clothes
			"Sweden", "India", "United Kingdom", "United States", "Turkey", //Countries
			"Monty Python's Life of Brian", "Let the Right One In (film)", "Forrest Gump", "Train to Busan", "Dangal (2016 film)", //Movies
			"Little Boy", "Sabre", "AK-47", "Nunchaku", "Bow and arrow", //Weapons
			"MS-DOS", "Amiga 500", "Apple II", "Commodore 64", "Vectrex", //Retro computing
			"Pokémon", "Super Mario", "Half-Life (series)", "Fallout (franchise)", "Tomb Raider", //Video game franchises
			"St Edward's Crown", "Wedding ring", "Necklace", "Body piercing", "Fabergé egg", //Jewelry
			"Coachella", "Super Bowl", "Saint Patrick's Day", "Diwali", "Midsummer", //Events
			"Wolfgang Amadeus Mozart", "Koji Kondo", "Hans Zimmer", "Antonio Vivaldi", "Ravi Shankar",  //Composers
			"Kiwifruit", "Mango", "Apple", "Lime (fruit)", "Pumpkin", //Fruits
			"C", "Morse code", "Å", "Z", "Infinity symbol", //Symbols
			"Swedish riksdaler", "Dollar", "Japanese yen", "Rupee", "Dubloon", //Money
			"Lassie", "Laika", "Hachikō", "Scooby-Doo", "Balto", //Dogs
			"Whisky", "Bloody Mary (cocktail)", "Tea", "Eggnog", "Dr Pepper", //Drinks
			"Atom", "Virus", "Bacteria", "Magnetism", "Electricity", //Invisible
			"Biryani", "Surströmming", "Sauerkraut", "Fish_and_chips", "Hamburger", //Food
			"Skateboard", "Pogo_stick", "Wheelchair", "Ice_skate", "Unicycle", //Transportation
			"Ganges", "Mississippi_River", "Göta älv", "River_Thames", "Nile", //Rivers
			"Buoy", "Sail", "Rudder", "Nautical_chart", "Sextant" //Sailing
		],
		sv: [
			"Bamse", "Snobben", "Asterix", "Son-Goku", "Tintin", //Cartoons
			"Saturnus", "Internationella rymdstationen", "Hubbleteleskopet", "Vintergatan", "Komet", //Space
			"Charlie Chaplin", "Helan och Halvan", "Mr. Bean", "Abbott och Costello", "Benny Hill", //Slapstick
			"Jesus", "Mose", "Muhammed", "Buddha", "L. Ron Hubbard", //Religion
			"Fot", "Svans", "Öga", "Näbb", "Hjärta", //Body parts
			"Kattbjörn", "Näbbdjur", "Hammarhajar", "Surikat", "Kaniner", //Animals
			"Telefon", "Hjul", "Ångmaskin", "Dator", "Teslaspole", //Inventions
			"Rubin", "Diamant", "Akvamarin", "Safir", "Smaragd", //Gemstones
			"Al Capone", "Ed Kemper", "Charles Manson", "Christer Pettersson", "Pablo Escobar", //Criminals
			"Matematik", "Fysik", "Astronomi", "Kemi", "Språk", //School subjects
			"Innebandy", "Karate", "Rally", "Cricket", "Amerikansk fotboll", //Sports
			"Europa", "Asien", "Afrika", "Nordamerika", "Australien", //Continents
			"Midas", "Carl XVI Gustaf", "Ludvig XVI av Frankrike", "Henrik VIII av England", "Ramses II", //Kings
			"Robotikens lagar", "Moores lag", "Newtons rörelselagar", "Öde", "Murphys lag", //Not really laws
			"Scarlett Johansson", "Izabella Scorupco", "Marilyn Monroe", "Judi Dench", "Michelle Yeoh", //Actresses
			"Lego", "Coca-Cola", "Adidas", "Samsung", "Ikea", //Brands
			"Näcken", "Chupacabra", "Bigfoot", "Enhörning", "Leprechaun", //Folklore
			"Boten Anna", "I'm Gonna Be (500 Miles)", "Nothing Else Matters", "Gangnam Style", "What a Wonderful World", //Singles
			"Uluru", "Fuji", "Grand Canyon", "Skogskyrkogården", "Victoriafallen", //Nature
			"Aftonbladet", "Youtube", "BBC", "Fox News Channel", "Snapchat", //Online media
			"Slaget vid Poltava", "Slaget vid Gettysburg", "Landstigningen i Normandie", "Slaget vid Hastings", "Bagdads fall", //Battles
			"VVS-montör", "Mekaniker", "Kock", "Pilot", "Programmerare", //Professions
			"Strumpor", "Jacka", "Sandaler", "Sombrero", "Kimono", //Clothes
			"Sverige", "Indien", "Storbritannien", "USA", "Turkiet", //Countries
			"Ett herrans liv (film)", "Låt den rätte komma in (film)", "Forrest Gump", "Train to Busan", //Movies
			"Little Boy", "Sabel", "AK-47", "Nunchaku", "Pilbåge", //Weapons
			"MS-DOS", "Amiga 500", "Apple II", "Commodore 64", "Vectrex", //Retro computing
			"Pokémon", "Super Mario (datorspelsserie)", "Half-Life (spelserie)", "Fallout (spelserie)", "Tomb Raider (spelserie)", //Video game francises
			"S:t Edvards krona", "Vigselring", "Halsband", "Piercing", "Fabergéägg", //Jewelry
			"Coachella Valley Music and Arts Festival", "Super Bowl", "Saint Patrick’s Day", "Diwali", "Midsommar", //Events
			"Wolfgang Amadeus Mozart", "Koji Kondo", "Hans Zimmer", "Antonio Vivaldi", "Ravi Shankar", //Composers
			"Kiwi", "Mango (frukt)", "Äpple", "Lime", "Pumpa", //Fruits
			"C", "Morsealfabetet", "Å", "Z", "Lemniskata", //Symbols
			"Riksdaler", "Dollar", "Yen", "Rupie", "Guldmynt", //Money
			"Lassie", "Lajka", "Hachikō", "Scooby-Doo", "Balto", //Dogs
			"Whisky", "Bloody Mary (drink)", "Te", "Äggtoddy", "Dr Pepper", //Drinks
			"Atom", "Virus", "Bakterier", "Magnetism", "Elektricitet", //Invisible
			"Biryani", "Surströmming", "Surkål", "Fish_and_chips", "Hamburgare", //Food
			"Skateboard", "Hoppstylta", "Rullstol", "Skridskor", "Enhjuling", //Transportation
			"Ganges", "Mississippifloden", "Göta älv", "Themsen", "Nilen", //Rivers
			"Boj", "Segel", "Roder", "Sjökort", "Sextant" //Sailing
		]
	},
	blacklist: {
		articles: ['Main_Page'],
		prefix: ['Portal', 'Special', 'Help', 'File', 'Wikipedia', 'Template', 'Category', 'Template talk']
	}
}