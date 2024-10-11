import { HmacSHA256, enc } from 'crypto-js';

export const validateInitDataRaw = (initDataRaw: string, botToken: string): boolean => {
  try {
    const params = new URLSearchParams(initDataRaw);
    const hash = params.get('hash');
    params.delete('hash');    
    let dataToCheck: string[] = [];
    params.sort();
    params.forEach((value, key) => {
      dataToCheck.push(`${key}=${value}`);
    });
    const dataCheckString = dataToCheck.join('\n');

    const secret = HmacSHA256(botToken, "WebAppData");
    const generatedHash = HmacSHA256(dataCheckString, secret).toString(enc.Hex);

    return generatedHash === hash;
  } catch (error) {
    console.error('Error validating InitDataRaw:', error);
    return false;
  }
};

export const pinFileToIPFS = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      body: formData,
      headers: {
        // TO DO think about this part
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5NmQ0Y2E2OS0yMzIzLTQ4ZTItODUyMy1iNDNjYWM4MmI2ZDciLCJlbWFpbCI6InN1c2hrYXp6bG8yQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyZGQ2Yzk0OTc2YWEzZjJlOGU3NSIsInNjb3BlZEtleVNlY3JldCI6IjhmMzBkZmMxOGYxYmFhZDdmMjZkZTgxYWUzYTBjMzdiYWUwMzVhYmE4ZmEyY2Q0ZjJkZDI3ZGI2NTk1MDM3NWUiLCJpYXQiOjE3MTUwNzkwMTJ9.7MSIV8UOX9ocQdpb5i6c_AT_idsXmzA9obCTEGAbRvs`,
      },
    });
    const { IpfsHash } = await res.json();
    return IpfsHash;
  } catch (error) {
    console.log(error);
    return error;
  }
};
