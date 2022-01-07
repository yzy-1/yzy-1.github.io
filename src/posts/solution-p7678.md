{"title":"P7678 题解","tags":["题解"],"uptime":1625221150}
---
严格一行 Python 3。

```python
print(len(input().strip().replace('c=','W').replace('c-','Y').replace('dz=','F').replace('d-','A').replace('lj','K').replace('nj','I').replace('s=','O').replace('z=','I')))
```

说下原理：Python 的 `s.replace(a,b)` 函数能将源字符串 `s` 中的所有子串 `a` 替换为字符串 `b`。题目让我们求的是「一共有多少个字母」，我们只要将「多字符字母」替换为任意的单个字符，再求出字符长度就可以得到答案。

