const themes = (await fetch("/theme").then((res) => res.json())).themes;
const settings = await fetch("/settings").then((res) => res.json());

export { themes, settings };
