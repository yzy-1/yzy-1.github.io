{"title":"CF1445A 题解","tags":["题解"],"uptime":1604447722}
---
题目思路
---

使用二分法, 首先将 $a, b$ 扔进两个 `std::multiset` 里.

因为要满足的条件是 $a_i + b_i \le x$, 即 $b_i \le x - a_i$,
我们可以遍历 $a$,
每次找到 $b$ 中最后一个 $\le x - a_i$ 的值,
并将其删除,
如果找不到这样的一个值, 说明无解.

时间复杂度 $\mathcal O (t \cdot n \log n^2)$

注意
---

- 由于原数组中元素可重, 所以不能用 `set`, 要用 `multiset`.
- C++ 没有提供找到 multiset 中最后一个 $\le x$ 元素的函数,
    但是它提供了找到第一个 $> x$ 元素的函数 `std::upper_bound`,
    我们可以直接用 `std::upper_bound` 函数返回的结果 $- 1$,
    来实现找到最后一个 $\le x$ 的元素.

Code
---

```cpp
inline void Solve() {
  for (const auto &item: a) {
    auto it = b.upper_bound(x - item);
    if (it == b.begin()) {
      // 这里需要特别判断一下, 如果 it == b.begin,
      // 那么 *(--it) 就会越界, 会导致程序 RE 出错
      puts("No");
      return;
    }
    --it;
    b.erase(it);
  }
  puts("Yes");
}
```
