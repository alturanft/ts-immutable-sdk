import { Eip1193Provider, BrowserProvider } from "ethers";
import { isMetaMaskProvider, isPassportProvider } from "./utils";

describe("providerUtils", () => {
  const mockPassportWeb3Provider = {
    provider: { isPassport: true } as unknown as Eip1193Provider,
  } as unknown as BrowserProvider;
  const mockMetaMaskWeb3Provider = {
    provider: { isMetaMask: true } as unknown as Eip1193Provider,
  } as unknown as BrowserProvider;

  describe("isPassport", () => {
    it("should return true when provider is valid and passport flag is true", () => {
      const result = isPassportProvider(mockPassportWeb3Provider);
      expect(result).toBe(true);
    });

    it("should return false when provider is valid and passport flag is missing", () => {
      const result = isPassportProvider(mockMetaMaskWeb3Provider);
      expect(result).toBe(false);
    });

    it("should return false when provider is undefined ", () => {
      const result = isPassportProvider(undefined);
      expect(result).toBe(false);
    });

    it("should return false when provider is null ", () => {
      const result = isPassportProvider(undefined);
      expect(result).toBe(false);
    });
  });

  describe("isMetaMask", () => {
    it("should return true when provider is valid and metamask flag is true", () => {
      const result = isMetaMaskProvider(mockMetaMaskWeb3Provider);
      expect(result).toBe(true);
    });

    it("should return false when provider is valid and metamask flag is missing", () => {
      const result = isMetaMaskProvider(mockPassportWeb3Provider);
      expect(result).toBe(false);
    });

    it("should return false when provider is undefined ", () => {
      const result = isMetaMaskProvider(undefined);
      expect(result).toBe(false);
    });

    it("should return false when provider is null ", () => {
      const result = isMetaMaskProvider(undefined);
      expect(result).toBe(false);
    });
  });
});
