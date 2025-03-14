import { create } from "zustand";
interface themeType{
	theme: string,
	setTheme:(theme:string)=> void
}
export const useThemeStore=create<themeType>((set)=>({
	theme: localStorage.getItem("chat-theme") || "dark",
	setTheme: (theme)=>{
		localStorage.setItem("chat-theme",theme);
		set({theme});
	},
}));