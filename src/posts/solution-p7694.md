{"title":"P7694 题解","tags":["题解"],"uptime":1625649182}
---
严格一行 Python 3。

```python
for i in [i if i.isupper() else "" for i in input()]:print(i,end="")
```

由于「每一个长变体中的单词开头一定是大写字母」，我们可以用列表生成式「筛选」出输入字符串中的所有大写字母，遍历输出即可。