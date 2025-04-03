export interface DayTasksCfg {
   /**任务id*/
   id: number; 
   /**任务名*/
   title: string; 
   /**任务类型&界面跳转
1=贡香
2=贡果
3=短信
4=升职
*/
   tasktype: number; 
   /**跳转到对应的界面*/
   gotoid: number; 
   /**目标数值
*/
   targetnum: number; 
   /**任务奖励*/
   reward: number; 

}

export class GameData {
   DayTasksCfg?: DayTasksCfg[];

}