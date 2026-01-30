import QRCode from "qrcode";

interface GenerateQrOptions {
  width?: number;
  margin?: number;
}

export async function generateQrBuffer(
  payloadUrl: string,
  options?: GenerateQrOptions
): Promise<Buffer> {
  return QRCode.toBuffer(payloadUrl, {
    type: "png",
    width: options?.width ?? 500,
    margin: options?.margin ?? 2,
    errorCorrectionLevel: "M",
  });
}
