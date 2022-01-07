{"title":"CF97C 题解","tags":["题解"],"uptime":1625443338}
---
今天模拟赛正好出了这道题，分享一种考场上写的做法。

考虑每种操作所能增加或减少多少个还能参加一次比赛的人数，我们设第 $i$ 种操作所增加的人数为 $b_i$，则：
$$
b_i=\begin{cases}n&i=1\\b_{i-1}-2 &\text{otherwise}.\end{cases}
$$
分析样例可得，最优策略一定是一个 $b_i>0$ 的 $i$ 操作和一个 $b_j<0$ 的 $j$ 操作不断交替，然后一直循环下去。根据贪心思想，因为数据保证 $p_i<p_j$，我们要让 $j$ 操作尽量的多。我们要让每次循环后的次数为 $1$ 的人数均不变，换句话说，$i$ 操作是为 $j$ 操作「提供」次数为 $1$ 的人数。计算方程
$$
xb_i+yb_j=0,
$$
可得出其中一个解是
$$
\begin{cases}x=-b_j\\y=b_i.\end{cases}
$$
如果按着这个循环不断重复无穷遍，则平均概率为：
$$
\frac{-b_jp_i+b_ip_j}{-b_j+b_i}.
$$
则答案为：
$$
\max_{i\in\{i|b_i>0\}}\max_{j\in\{j|b_j<0\}}\frac{-b_jp_i+b_ip_j}{-b_j+b_i}
$$
另外有一种情况需要特判，就是存在一个 $k$ 使得 $b_k=0$ 的情况，当 $b_k=0$ 时我们可以只选择一种操作不断重复，平均概率为 $p_k$。这种情况下的答案为 $\max\{\text{原答案},p_k\}$。

```cpp
signed main() {
  n = in;
  int nowone = n;
  rep(i, 0, n) {
    lf p;
    cin >> p;
    if (nowone > 0)
      zheng.insert({nowone, p});
    else if (nowone == 0)
      ans = p;
    else
      fu.insert({nowone, p});
    nowone -= 2;
  }
  each(z, zheng) {
    each(f, fu) {
      lf res = (f.gx * z.one + z.gx * (-f.one)) / (z.one - f.one);
      up(ans, res);
    }
  }
  printf("%.12LF\n", ans);
  return 0;
}
```