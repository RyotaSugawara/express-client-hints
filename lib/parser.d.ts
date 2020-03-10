export interface UABrandVersion {
    brand: string;
    version: string;
}
export declare const shListParser: (shList: string) => string[];
export declare const earlyChUaParser: (uaString: string) => UABrandVersion;
export declare const greaseLikeUserAgentParser: (uaString: string) => UABrandVersion;
export declare const clientHintsUserAgentParser: (shList: string) => UABrandVersion[];
//# sourceMappingURL=parser.d.ts.map