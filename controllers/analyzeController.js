const axios = require('axios');
const UserStats = require('../models/UserStats');

const TAG_ALIASES = {
  'dp': 'Dynamic Programming',
  'dynamic programming': 'Dynamic Programming',
  'math': 'Math',
  'mathematics': 'Math',
  'graphs': 'Graph',
  'graph': 'Graph',
  'two pointers': 'Two Pointers',
  'greedy': 'Greedy',
  'string': 'String',
  'strings': 'String',
  'data structures': 'Data Structures',
  'binary search': 'Binary Search',
  'dfs and similar': 'DFS/BFS',
  'depth-first search': 'DFS/BFS',
  'breadth-first search': 'DFS/BFS',
  'trees': 'Tree',
  'tree': 'Tree',
  'sortings': 'Sorting',
  'sorting': 'Sorting',
  'implementation': 'Implementation',
  'brute force': 'Brute Force',
  'constructive algorithms': 'Constructive',
  'number theory': 'Number Theory',
  'geometry': 'Geometry',
  'bit manipulation': 'Bitmasks',
  'bitmasks': 'Bitmasks'
};

function normalizeTag(tag) {
  const t = tag.toLowerCase();
  return TAG_ALIASES[t] || tag.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function fetchCodeforcesTags(handle) {
  try {
    const res = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
    if (res.data.status !== 'OK') throw new Error('Codeforces API error');

    const tagsCount = {};
    const solvedProblems = new Set();

    res.data.result.forEach(sub => {
      if (sub.verdict === 'OK') {
        const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
        if (!solvedProblems.has(problemId)) {
          solvedProblems.add(problemId);
          sub.problem.tags.forEach(tag => {
            const normalized = tag.toLowerCase();
            tagsCount[normalized] = (tagsCount[normalized] || 0) + 1;
          });
        }
      }
    });
    return tagsCount;
  } catch (error) {
    return {};
  }
}

async function fetchLeetCodeTags(handle) {
  try {
    const res = await axios.get(`https://alfa-leetcode-api.onrender.com/skillStats/${handle}`);
    const data = res.data;
    const tagCounts = {};
    let counts = null;
    
    if (data && data.matchedUser && data.matchedUser.tagProblemCounts) {
      counts = data.matchedUser.tagProblemCounts;
    } else if (data && data.data && data.data.matchedUser && data.data.matchedUser.tagProblemCounts) {
      counts = data.data.matchedUser.tagProblemCounts;
    }

    if (counts) {
      const categories = ['advanced', 'intermediate', 'fundamental'];
      categories.forEach(cat => {
        if (counts[cat]) {
          counts[cat].forEach(item => {
            const normalized = item.tagName.toLowerCase();
            tagCounts[normalized] = (tagCounts[normalized] || 0) + item.problemsSolved;
          });
        }
      });
    }
    return tagCounts;
  } catch (error) {
    return {};
  }
}

function aggregateTags(cfData, lcData) {
  const merged = {};
  const process = (data) => {
    Object.entries(data).forEach(([tag, count]) => {
      const normalized = normalizeTag(tag);
      merged[normalized] = (merged[normalized] || 0) + count;
    });
  };

  process(cfData);
  process(lcData);

  const validTags = Object.entries(merged).filter(([tag]) => tag !== '*special' && tag !== 'Implementation' && tag !== 'Unknown');

  const sortedDesc = [...validTags].sort((a, b) => b[1] - a[1]);
  const top8 = sortedDesc.slice(0, 8);
  const maxCount = top8.length > 0 ? top8[0][1] : 100;
  const fullMark = Math.ceil(maxCount * 1.2); 

  const formatTag = ([subject, count]) => ({ subject, A: count, fullMark });

  const chartData = top8.map(formatTag);
  const strengths = sortedDesc.slice(0, 5).map(formatTag);
  const weaknesses = [...validTags].sort((a, b) => a[1] - b[1]).slice(0, 5).map(formatTag);

  return { chartData, strengths, weaknesses };
}

exports.analyzeProfile = async (req, res) => {
  try {
    const { cfHandle = '', lcHandle = '' } = req.body;
    if (!cfHandle && !lcHandle) return res.status(400).json({ error: 'Please provide at least one handle.' });

    const cachedData = await UserStats.findOne({ cfHandle, lcHandle });
    if (cachedData && (Date.now() - cachedData.lastUpdated < 24 * 60 * 60 * 1000)) {
      return res.json({
        chartData: cachedData.chartData,
        strengths: cachedData.strengths,
        weaknesses: cachedData.weaknesses,
        cached: true
      });
    }

    const [cfData, lcData] = await Promise.all([
      cfHandle ? fetchCodeforcesTags(cfHandle) : Promise.resolve({}),
      lcHandle ? fetchLeetCodeTags(lcHandle) : Promise.resolve({})
    ]);

    const aggregated = aggregateTags(cfData, lcData);
    if (aggregated.chartData.length === 0) return res.status(404).json({ error: 'No problem-solving data found.' });

    await UserStats.findOneAndUpdate(
      { cfHandle, lcHandle },
      { ...aggregated, lastUpdated: Date.now() },
      { upsert: true, new: true }
    );

    return res.json({ ...aggregated, cached: false });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
