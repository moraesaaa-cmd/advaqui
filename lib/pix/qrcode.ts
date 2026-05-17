import { PIX } from "@/lib/config";

const sanitizeText = (s: string, max: number): string =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .slice(0, max)
    .trim();

const id = (id: string, value: string): string => {
  const size = value.length.toString().padStart(2, "0");
  return `${id}${size}${value}`;
};

const crc16 = (input: string): string => {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
};

type PixPayloadOptions = {
  txid?: string;
  amount?: number;
  message?: string;
};

export const buildPixPayload = (opts: PixPayloadOptions = {}): string => {
  const key = PIX.key;
  const name = sanitizeText(PIX.receiverName, 25) || "AdvAqui";
  const city = sanitizeText(PIX.receiverCity, 15) || "BRASIL";
  const amount = (opts.amount ?? PIX.amount).toFixed(2);
  const txid = sanitizeText(opts.txid || "AdvAqui", 25);

  const merchantAccount = id("00", "br.gov.bcb.pix") + id("01", key);
  const additionalData = id("05", txid);

  const payloadBase =
    id("00", "01") +
    id("26", merchantAccount) +
    id("52", "0000") +
    id("53", "986") +
    id("54", amount) +
    id("58", "BR") +
    id("59", name) +
    id("60", city) +
    id("62", additionalData) +
    "6304";

  const crc = crc16(payloadBase);
  return payloadBase + crc;
};
