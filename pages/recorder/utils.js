/**
 * 把 PCM 文件解析成计算音量百分比
 * 返回值：0-100，主要当做百分比用；注意：这个不是分贝
 * 
 * 计算音量参考 https://blog.csdn.net/jody1989/article/details/73480259
 * 更高灵敏度算法: 限定最大感应值 10000 线性曲线：低音量不友好 power/10000*100
 * 对数曲线：低音量友好，但需限定最低感应值 (1+Math.log10(power/10000))*100
 * 
 * @param frameBuffer PCM 文件分片数据
 * 
 */
const pcmToPowerLevel = frameBuffer => {
  let level = 0;
  if (frameBuffer) {
    let arr = new Int16Array(frameBuffer);
    let pcmAbsSum = 0; // PCM Int16 所有采样的绝对值的和
    if (arr && arr.length) {
      arr.map(ele => {
        pcmAbsSum = pcmAbsSum + Math.abs(ele);
      })
    }
    const pcmLength = frameBuffer.byteLength; // PCM的字节长度
    let power = (pcmAbsSum / pcmLength) || 0;//NaN
    if (power < 1251) { // 1250的结果10%，更小的音量采用线性取值
      level = Math.round(power / 1250 * 10);
    } else {
      level = Math.round(Math.min(100, Math.max(0, (1 + Math.log(power / 10000) / Math.log(10)) * 100)));
    };
  }
  return level;
};
export default pcmToPowerLevel;