export default function postNetworkQualityStats(
  roomId,
  userId,
  networkQualityLevel,
  networkQualityStats
) {
  // return and post the networkQualityLevel
  if (roomId && networkQualityStats) {
    fetch('/api/network-quality', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId,
        userId,
        networkQualityLevel,
        audioRecv: networkQualityStats.audio.recv,
        audioSend: networkQualityStats.audio.send,
        videoRecv: networkQualityStats.video.recv,
        videoSend: networkQualityStats.video.send,
      }),
    });
  }
}
