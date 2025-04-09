export enum LobbyType{
    /**大雄宝殿 */
    DaXiongBaoDian = 1,
    /**月老殿 */
    YueLaoDian,
    /**观音殿 */
    GuanyinDian,
    /**文殊殿 */
    WenShuDian,
    /**财神殿 */
    CaiShenDian,
    /**放生池 */
    FangShengChi,

}

// 定义枚举值到字符串的映射
export const LobbyTypeStr: Record<LobbyType, string> = {
    [LobbyType.DaXiongBaoDian]: "大雄宝殿",
    [LobbyType.YueLaoDian]: "月老殿",
    [LobbyType.GuanyinDian]: "观音殿",
    [LobbyType.WenShuDian]: "文殊殿",
    [LobbyType.CaiShenDian]: "财神殿",
    [LobbyType.FangShengChi]: "放生池",
};

export enum ShangGongType{
    /**香火 */
    XiangHuo = 1,
    /**供花 */
    GongHua,
    /**供果 */
    GongGuo,
    /**拜佛 */
    BaiFo,
}
