{"title":"CF1454B 题解","tags":["题解"],"uptime":1606532549}
---
题目大意
---

共 $t (t\le2\times10^4)$ 组数据,
对于每组数据输入一个整数 $n (1 \le n \le 10^5)$
和一个长度为 $n$ 的数组 $a(1\le a_i \le n)$.
请找到数组中只出现过一次且最小的数**的下标** (从 $1$ 开始),
如果找不到这样的数则输出 $-1$.

对于所有测试点满足 $\sum_n \le 10^5$.

做法
--

使用 `std::vector` 开桶, 统计每个数字在数组中出现的位置, 然后 $\mathcal O(n)$
扫一遍, 找到最小的符合要求的数即可.

Code
---

```cpp
int t, n;
std::vector<int> sum[N];
int main() {
  scanf("%d", &t);
  while (t--) {
    bool fl = false;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
      int x;
      scanf("%d", &x);
      sum[x].push_back(i);
    }
    for (int i = 1; i <= n; ++i) {
      if (sum[i].size() == 1) {
        printf("%d\n", sum[i][0]);
        fl = true;
        break;
      }
    }
    if (!fl) puts("-1");
    for (int i = 1; i <= n; i++) {
      sum[i].clear();
    }
  }
  return 0;
}
```