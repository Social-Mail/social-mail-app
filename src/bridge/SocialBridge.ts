export default abstract class SocialBridge {

    public static instance: SocialBridge;

    public abstract setTitle(v: string);

    public abstract openHost(host: string);

}

if (typeof window !== "undefined") {
    if(typeof (window as any).SocialBridge !== "undefined") {
        SocialBridge.instance = (window as any).SocialBridge;
    }
}
