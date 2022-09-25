module.exports = {
  secretKey: '임강준현영구', // 원하는 시크릿 
  options: {
      algorithm: "HS256", // 해싱 알고리즘
      expiresIn: "1h",  // 토큰 유효 기간
      issuer: "dokdogalmaegi" // 발행자
  },
  refreshTokenOptions: {
      algorithm: "HS256", // 해싱 알고리즘
      expiresIn: "14d",  // 토큰 유효 기간
      issuer: "dokdogalmaegi" // 발행자
  }
}