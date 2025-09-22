// Define available hat types
export type HatType = {
	id: string;
	name: string;
	image: string; // URL or path to hat image/icon
};

export const HAT_TYPES: HatType[] = [
	{ id: 'baseball', name: 'Duck Cap', image: '/hats/baseball.png' },
	{ id: 'top', name: 'Top Hat', image: '/hats/top.png' },
	{ id: 'beanie', name: 'Beanie', image: '/hats/beanie.png' },
	{ id: 'cowboy', name: 'Cowboy Hat', image: '/hats/cowboy.png' },
];
