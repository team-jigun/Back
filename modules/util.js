module.exports = {
  fail: (code, message) => { 
    return {
      code, 
      message
    }
  },
  success: (code, message, options = {}) => { 
    return {
      code,
      message, 
      options 
    }
  }
}