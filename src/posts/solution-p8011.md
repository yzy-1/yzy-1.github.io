---
title: P8011 题解
tags: ["题解"]
uptime: 1641387004
---

这里是出题人官方题解。

## subtask 1

这不就 AC 自动机板子吗？

## subtask 2

爆搜，枚举所有可能的 $S$，算概率相加即可。

```cpp
void Dfs(int x, int mx) {
  if (x == mx + 1) {
    int cnt = 0;
    re (i, m) {
      re (l, mx) {
        int r = l + b[i].size() - 1;
        if (r > mx) break;
        bool fl = 1;
        rep (j, 0, b[i].size() - 1)
          if (b[i][j] != now[l + j]) {
            fl = 0;
            break;
          }
        if (fl) ++cnt;
      }
    }
    int gl = 1;
    re (i, mx)
      gl = 1ll * gl * p[a[i]][now[i]] % mo;
    if (cnt & 1) ans[mx] += gl, umod(ans[mx]);
    return;
  }
  re (i, K)
    now[x] = i, Dfs(x + 1, mx);
}
```

## subtask 3

设 $f(i,j)$ 为当前 dp 到第 $i$ 位，串的末尾有 $j$ 个 $1$ 的概率，$g(i,j)$ 为当前 dp 到第 $i$ 位，串的末尾有 $j$ 个 $1$ 时期望的致病性细菌个数。枚举 $i,j$ 转移即可。

```cpp
void Solve() {
  re (i, K) {
    in(p[i], K);
    re (j, K)
      sump[i] += p[i][j], umod(sump[i]);
    int ny = Pow(sump[i], mo - 2, mo);
    re (j, K)
      p[i][j] = 1ll * p[i][j] * ny % mo;
    sump[i] = 0;
    re (j, K)
      sump[i] += p[i][j], umod(sump[i]);
  }
  f[0][0] = 1;
  re (i, n) {
    rep (j, 0, i) {
      f[i][0] += 1ll * f[i - 1][j] * ((mo + sump[a[i]] - p[a[i]][1]) % mo) % mo, umod(f[i][0]);
      g[i][0] += 1ll * g[i - 1][j] * ((mo + sump[a[i]] - p[a[i]][1]) % mo) % mo, umod(g[i][0]);
    }
    re (j, i) {
      f[i][j] = 1ll * f[i - 1][j - 1] * p[a[i]][1] % mo, umod(f[i][j]);
      g[i][j] = 1ll * g[i - 1][j - 1] * p[a[i]][1] % mo, umod(g[i][j]);
    }
    rep (j, 0, i) {
      if (j >= (int)b[1].size()) g[i][j] = (0ll + mo + f[i][j] - g[i][j]) % mo;
      ans[i] += 1ll * g[i][j] % mo, umod(ans[i]);
    }
  }
}
```

## subtask 4

将所有 $g_i$ 建出 AC 自动机。设 $f(i,j)$ 表示当前是 $S$ 的第 $i$ 个字符，且当前正好走到 AC 自动机的第 $j$ 个节点的概率。$g(i,j)$ 表示当前是 $S$ 的第 $i$ 个字符，在自动机的 $j$ 号节点时出现的致病细菌的期望个数，转移即可。注意要用滚动数组压一下内存。

注意需要提前用拓朴排序预处理一遍来保证复杂度。具体方式类似 [AC 自动机（二次加强版）](https://www.luogu.com.cn/problem/P5357)。

时间复杂度 $O(n\sum|g_i|)$。

```cpp
struct Trie {
  int e[N][109], ed[N], fal[N], tot = 1;
  void Ins(const vector<int> &v) {
    int x = 1;
    each (c, v)
      x = e[x][c] = (e[x][c] ?: ++tot);
    ++ed[x];
  }
  void AC() {
    re (i, K)
      e[0][i] = 1;
    queue<int> q{{1}};
    while (!q.empty()) {
      int x = q.front();
      q.pop();
      re (c, K) {
        if (e[x][c])
          fal[e[x][c]] = e[fal[x]][c], q.push(e[x][c]);
        else
          e[x][c] = e[fal[x]][c];
      }
    }
  }
} tr;

struct G {
  int tot, h[N];
  struct E {
    int t, n;
  } e[N];
  inline void Add(int f, int t) { e[++tot] = {t, h[f]}, h[f] = tot; }
} falg;

int f[2][N], g[2][N], ans[N], p[1009][1009], sump[1009], n, a[N], m, T, sumed[N], rd[N];
vector<int> b[N];

void Topo() {
  re (i, tr.tot)
    if (tr.fal[i]) falg.Add(tr.fal[i], i), ++rd[i], sumed[i] += tr.ed[i];
  queue<int> q;
  re (i, tr.tot)
    if (rd[i] == 0) q.push(i);
  while (!q.empty()) {
    int qf = q.front();
    q.pop();
    nxt (i, qf, falg) {
      auto t = falg.e[i].t;
      sumed[t] += sumed[qf];
      if (--rd[t] == 0) q.push(t);
    }
  }
}

void DP() {
  f[0][1] = 1;
  rep (i, 0, n) {
    int ii = i & 1;
    re (j, tr.tot) {
      g[ii][j] = 1ll * Pow(f[ii][j], mo - 2, mo) * g[ii][j] % mo;
      if (sumed[j] & 1) g[ii][j] = (1ll + mo - g[ii][j]) % mo;
      ans[i] += 1ll * f[ii][j] * g[ii][j] % mo, umod(ans[i]);
      re (c, K) {
        int t = tr.e[j][c];
        ll gx = 1ll * f[ii][j] * p[a[i + 1]][c] % mo;
        f[ii ^ 1][t] += gx, umod(f[ii ^ 1][t]);
        g[ii ^ 1][t] += gx * g[ii][j] % mo, umod(g[ii ^ 1][t]);
      }
    }
    rep (j, 0, tr.tot)
      f[ii][j] = 0, g[ii][j] = 0;
  }
}

```

## subtask 5~6

我们发现 $P$ 矩阵可以矩乘。快速幂预处理后按照 sub4 的方法做即可。

时间复杂度 $O(n\sum|g_i|+k^3 \log t)$。
