{"title":"P7998 题解","tags":["题解"],"uptime":1640737675}
---
## 题目大意

有一个数 $x \in [1,n]$，并非一开始就确定，每次你可以选择一个区间 $[a,b]$（花费 $\dfrac{1}{b-a+1}$ 的代价），交互库会选择一个数 $c \in [a,b]$ 并告诉你 $c$ 与 $x$ 的大小关系，现在你需要在 $1.9813035$ 总代价内求出 $x$。

## 做法

考虑 DP，设 $dp(i)$ 表示当前要猜的是大小为 $i$ 的区间时，要猜到数字最差情况所耗费的代价。则有：
$$
dp(i)=\begin{cases}
0 & i\le 1\\
\min_{j=1}^i \frac 1 j + dp(\max(L-1,i-L,L+j-2,i-L-j+1)) & i>1
\end{cases}
$$
其中 $L$ 代表 $\lfloor \dfrac{1+i}2 \rfloor - \lfloor \dfrac{j-1} 2 \rfloor$。可以发现，$dp(10^5)\simeq 1.98130349020495$，可见这个做法正确性没有问题。DP 的同时记录一下每个状态是从哪个状态转移来的，就得到了最优决策点。每次询问时用预处理出来的最优决策点作答。但是发现这个 DP 是 $O(n^2)$ 的，时间复杂度过高，无法通过此题，考虑另一种做法——打表。

---

先将每个状态 $dp(i)$ 所对应的最优转移来源 $dp1(i)$ 进行打表。代码：

```cpp
int n,dp1[N]; lf dp2[N];

signed main() {
  dp2[0] = 0;
  dp2[1] = 0;
  printf("1\n");
  rep(i, 2, 1e5) {
    dp2[i] = INFINITY;
    int mid = (1 + i) / 2;
    re(j, i) {
      int l = mid - (j - 1) / 2, r = l + j - 1,
          res = max({l - 1, i - l, r - 1, i - r});
      if (dp2[res] + 1.l / j < dp2[i])
        dp2[i] = dp2[res] + 1.l / j, dp1[i] = j;
    }
    printf("%d\n",dp1[i]);
  }
  return 0;
}
```



你会发现这个表太大了导致提交不到 OJ 上。我们可以先把数据扔进 Excel 里可视化：

![](https://cdn.luogu.com.cn/upload/image_hosting/rlkwd8xj.png)

可以发现，数据中形成了几条直线，所以可以只将前 $10^4$ 个数据打成表，将后面的数据拟合成一个分段函数：
$$
F(i)=\begin{cases}
\text{biao}_i & i\le 1000\\
4938 & i\le 13383\\
7000 & i\le 19690\\
9900 & i \le 27902\\
14030 & i \le 39555\\
19853 & i \le 55906\\
28114 & i \le 79133\\
39600 & i \le 10^5
\end{cases}
$$
利用这个函数作为二分的决策点，可写出以下代码：

```cpp
const int biao[11234]={/*省略数据表*/};
int F(int x) {
  if (x <= 10000)
    return biao[x];
  if (x <= 13383)
    return 4938;
  if (x <= 19690)
    return 7000;
  if (x <= 27902)
    return 9900;
  if (x <= 39555)
    return 14030;
  if (x <= 55906)
    return 19853;
  if (x <= 79133)
    return 28114;
  return 39600;
}
void Ans(int x) {
  cout << "! " << x << '\n' << flush;
  exit(0);
}
pair<int, int> Ask(int l, int r) {
  cout << "? " << l << ' ' << r << '\n' << flush;
  int x, y;
  cin >> x >> y;
  return {x, y};
}
void ErFen(int l, int r) {
  if (l == r)
    Ans(l);
  int len = r - l + 1, mid = (l + r) / 2, res = F(len),
      L = mid - (res - 1) / 2, R = L + res - 1;
  auto [u, v] = Ask(L, R);
  if (v == 1)
    Ans(u);
  else if (v == 2)
    ErFen(l, u - 1);
  else
    ErFen(u + 1, r);
}
```

代码量就降到了 48k，这就可以交到 OJ 上了。这个代码得到了 99pt，最后一个点超出标准次数 $2\times 10^{-7}$ 次。

---

既然函数拟合的不够好，可以再用 DP 把函数上下扰动调整一下。DP 的第二维改成从 $F(i)-\Delta$ 枚举到 $F(i)+\Delta$。采用 $\Delta=5$ 时，可以通过此题。

```cpp
signed main() {
  dp2[0] = 0;
  dp2[1] = 0;
  rep(i, 2, 1e5) {
    dp2[i] = INFINITY;
    int mid = (1 + i) / 2;
    rep(j, max(1, F(i) - 5), min(i, F(i) + 5)) {
      int l = mid - (j - 1) / 2, r = l + j - 1,
          res = max({l - 1, i - l, r - 1, i - r});
      if (dp2[res] + 1.l / j < dp2[i])
        dp2[i] = dp2[res] + 1.l / j, dp1[i] = j;
    }
  }
  cin >> n;
  ErFen(1, n);
  return 0;
}
```