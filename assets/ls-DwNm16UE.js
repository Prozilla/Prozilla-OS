import{f as c,A as n}from"./index-Bx8jo-xd.js";import{C as f}from"./command-Clc1HLU6.js";const m=new f().setManual({purpose:"List directory contents",usage:"ls [options] [files]",description:"List information about directories or files (the current directory by default)."}).setExecute(function(e,{currentDirectory:r}){let t=r;if(e.length>0&&(t=r.navigate(e[0])),!t)return c(this.name,`Cannot access '${e[0]}': No such file or directory`);const i=t.subFolders.map(o=>`${n.fg.blue}${o.id}${n.reset}`),a=t.files.map(o=>o.id),s=i.concat(a);return s.length===0?{blank:!0}:s.sort().join("  ")});export{m as ls};