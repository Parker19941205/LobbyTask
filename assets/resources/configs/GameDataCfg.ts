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
   /**跳转到对应的界面 
1= 大雄宝殿
2= 月老殿
3= 观音殿
4= 文殊殿
5= 财神殿
6= 放生池*/
   gotoid: number; 
   /**目标数值*/
   targetnum: number; 
   /**任务奖励（功德）*/
   reward: number; 

}

export interface SignCfg {
   /**天数*/
   id: number; 
   /**奖励物品id*/
   reward: number; 

}

export interface GoodsCfg {
   /**id*/
   id: number; 
   /**物品id(对应物品资源图)*/
   goodsid: number; 
   /**物品名称*/
   name: string; 

}

export interface ScoreExchangeCfg {
   /**序号*/
   id: number; 
   /**兑换物品id*/
   goodsid: number; 
   /**需要积分*/
   score: number; 

}

export class GameData {
   DayTasksCfg?: DayTasksCfg[];
   SignCfg?: SignCfg[];
   GoodsCfg?: GoodsCfg[];
   ScoreExchangeCfg?: ScoreExchangeCfg[];

}