module.exports = {
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/src/app/tests/setupTests.js"],
	moduleNameMapper: {
		"^@/app/(.*)$": "<rootDir>/src/app/$1",
		"^@/components/(.*)$": "<rootDir>/src/components/$1",
		"^@/lib/(.*)$": "<rootDir>/src/lib/$1",
	},
	testMatch: ["**/__tests__/**/*.js", "**/*.test.js"],
	transform: {
		"^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
	},
	moduleFileExtensions: ["js", "jsx", "json", "node"],
	testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};
