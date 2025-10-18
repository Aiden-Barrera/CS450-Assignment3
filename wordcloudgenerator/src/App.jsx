import { useState, useEffect } from 'react'
import * as d3 from 'd3'
import './App.css'

function App() {
  const [wordfreq, setWordfreq] = useState([])
  const [inputField, setInputField] = useState("")
  const [btn, setBtn] = useState(false)

  const getWordFreq = (text) => {
    const stopWords = new Set(["the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from", "that", "which", "who", "whom", "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours", "you", "your", "yours", "he", "him", "his", "she", "her", "hers", "it", "its", "we", "us", "our", "ours", "they", "them", "theirs", "I", "me", "my", "myself", "you", "your", "yourself", "yourselves", "was", "were", "is", "am", "are", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "as", "if", "each", "how", "which", "who", "whom", "what", "this", "these", "those", "that", "with", "without", "through", "over", "under", "above", "below", "between", "among", "during", "before", "after", "until", "while", "of", "for", "on", "off", "out", "in", "into", "by", "about", "against", "with", "amongst", "throughout", "despite", "towards", "upon", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't", "doesn't", "didn't", "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't", "shouldn't", "mustn't", "needn't", "daren't", "hasn't", "haven't", "hadn't"]);
    const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");
    const filteredWords = words.filter(word => !stopWords.has(word));
    return Object.entries(filteredWords.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {}));
  }

  const renderChart = () => {
    const data = wordfreq?.sort((a, b) => b[1] - a[1]).slice(0, 5);
    
    const svg = d3.select(".svg_parent");
    
    const width = 1000;
    const height = 400;
    svg.attr("width", width).attr("height", height);
    
    if (data.length === 0) return;
    
    const fontScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[1]), d3.max(data, d => d[1])])
      .range([30, 70])
      .clamp(true);
    
    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([100, width - 100]);
    
    svg.selectAll("text")
      .data(data, d => d[0])
      .join(
        enter => enter.append("text")
          .text(d => d[0])
          .attr("x", (d, i) => xScale(i))
          .attr("y", height / 2)
          .transition()
          .duration(2000)
          .attr("font-size", d => fontScale(d[1]))
          .attr("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
          .attr("text-anchor", "middle"),

        update => update.transition()
          .duration(2000)
          .attr("x", (d, i) => xScale(i))
          .attr("font-size", d => fontScale(d[1])),

          exit => exit.remove()
      );
  }

  useEffect(() => {
    renderChart();
  }, [btn])

  return (
    <>
      <div className="parent">
        <div className="child1" style={{width: 1000 }}>
        <textarea type="text" id="input_field" value={inputField} onChange={(e) => setInputField(e.target.value)} style={{ height: 150, width: 1000 }}/>
          <button type="submit" value="Generate Matrix" style={{ marginTop: 10, height: 40, width: 1000 }} onClick={() => {
                setWordfreq(getWordFreq(inputField))
                setBtn(!btn)
              }}
            > Generate WordCloud</button>
        </div>
        <div className="child2"><svg className="svg_parent"></svg></div>
      </div>
    </>
  )
}

export default App
