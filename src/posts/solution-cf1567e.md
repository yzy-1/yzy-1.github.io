{"title":"CF1567E 题解","tags":["题解"],"uptime":1630925545}
---
## 题目大意

单点修改，区间严格不降子区间计数。

## 简要做法

考虑分块，每个块内维护所有极大不降区间的两个端点。这样一个长度为 $L$ 的极大不降区间的对答案的贡献就为 $\sum_{i=1}^L i$。

对于单点修改，直接暴力重构整个块。

比较麻烦的是块与块之间的拼接，我们可以记录「最后一个遍历到的区间」是什么，然后在遍历到一个新块时判断这个块的第一个元素是否大于等于上一个块的最后一个元素，如果是则可以将这个块的第一个极大区间和「最后一个遍历到的区间」进行合并。

时间复杂度 $O(n+q\sqrt n)$，空间复杂度 $O(n)$。可以通过此题。

```cpp
int bl[N], lbl[N], rbl[N], a[N], sz, n, m, sum[N];
vector<pair<int, int>> vec[N];

int Sum(int x) { return x * (x + 1) / 2; }

void Up(int x) {
  int b = bl[x];
  vec[b].clear();
  vec[b].push_back({lbl[x], lbl[x]});
  rep (i, lbl[x] + 1, rbl[x]) {
    if (a[i - 1] <= a[i])
      ++vec[b].back().second;
    else
      vec[b].push_back({i, i});
  }
  sum[b] = 0;
  each (x, vec[b])
    sum[b] += Sum(x.second - x.first + 1);
}

void Init() {
  sz = max((ll)sqrt(n), 3ll);
  rep (i, 1, n) {
    bl[i] = (i - 1) / sz + 1;
    lbl[i] = (bl[i] - 1) * sz + 1;
    rbl[i] = min(bl[i] * sz, n);
  }
  ste(i, 1, n, sz) Up(i);
}

void Set(int p, int x) {
  a[p] = x;
  Up(p);
}

int Ask(int l, int r) {
  int res = 0;
  if (bl[l] == bl[r]) {
    vector<pair<int, int>> v;
    v.push_back({l, l});
    rep (i, l + 1, r) {
      if (a[i - 1] <= a[i])
        ++v.back().second;
      else
        v.push_back({i, i});
    }
    each (x, v)
      res += Sum(x.second - x.first + 1);
    return res;
  }
  res += Ask(l, rbl[l]);
  pair<int, int> lst = vec[bl[l]].back();
  up(lst.first, l);
  ste(i, lbl[l] + sz, rbl[r] - sz, sz) {
    int b = bl[i];
    res += sum[b];
    // 拼接
    if (a[lbl[i] - 1] <= a[lbl[i]]) {
      res -= Sum(vec[b][0].second - vec[b][0].first + 1);
      res -= Sum(lst.second - lst.first + 1);
      res += Sum(vec[b][0].second - lst.first + 1);
      up(lst.second, vec[b][0].second);
    }
    if (lst.second != rbl[i]) lst = vec[b].back();
  }
  if (a[lbl[r] - 1] <= a[lbl[r]]) {
    res -= Sum(min(r, vec[bl[r]][0].second) - vec[bl[r]][0].first + 1);
    res -= Sum(lst.second - lst.first + 1);
    res += Sum(min(r, vec[bl[r]][0].second) - lst.first + 1);
  }
  res += Ask(lbl[r], r);
  return res;
}
```



