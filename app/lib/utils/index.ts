// const shareInviteLink = () => {
//     logEvent(analytics, "share", {
//       method: "Telegram",
//       content_type: "miniapp",
//     });
//     const url = encodeURI(`https://t.me/vself_bot/staging?startapp=${userId}`);
//     const text = encodeURI(SHARING_MESSAGE); //
//     window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
//     navigator.clipboard.writeText(
//       `https://t.me/vself_bot/staging?startapp=${userId}`
//     );
//   };