import axios from "axios";
import React from "react";

export default async function StarCount() {
	try {
		const { data } = await axios.get<{ stargazers_count: number }>(
			"https://api.github.com/repos/whoisasx/Canvora",
			{ headers: { Accept: "application/vnd.github.v3+json" } }
		);

		const starCount =
			typeof data?.stargazers_count === "number"
				? data.stargazers_count
				: 0;
		return <span>{starCount.toLocaleString()} </span>;
	} catch (error) {
		return <span>1</span>;
	}
}
