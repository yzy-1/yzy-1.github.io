{"title":"计算几何笔记","tags":["笔记"],"uptime":1616492568}
---
# 计算几何笔记

## EPS 与实数比较

我们在判断两个整数是否相等的时候通常会用等于号直接比较，但是由于浮点数 `double` 有精度误差，在比较时，需要允许一定的误差。比如比较浮点数 $a,b$ 是否相等时，如果 $|a-b| \le \mathrm{eps}$，则认为 $a=b$。

```cpp
const double eps = 1e-9; // 对于大部分题目 1e-9 足够小了

bool fsame(double a, double b) { return fabs(a - b) <= eps; }
```

## 向量

对于一个还没有系统学习高中数学的 OIer 来说，我把向量理解成一条从 $(0,0)$ 到 $(x,y)$ 的带箭头的线段，记作 $\overrightarrow{(x,y)}$。

线段可以转化为向量，只需要将线段的起点平移到 $(0,0)$ 即可。

```cpp
// 不要用 y1 这个名字！这会和 cmath 里面的一个东西重复导致 CE / RE
#define y1 y1__
// 将 (x1, y1) -> (x2, y2) 的线段转化为向量
pair<double, double> toVec(double x1, double y1, double x2, double y2) {
  return make_pair(x2 - x1, y2 - y1);
}
```

「向量范数」（norm）指向量长度的平方，我们可以用勾股定理求出它，比如向量 $\overrightarrow{(x,y)}$ 的 norm 为 $x^2+y^2$。

两个向量 $v_1，v_2$ 的夹角 $\langle v_1,v_2 \rangle$ 指从 $v_1$ 旋转到 $v_2$ 所经过的角度（弧度制），逆时针为正，顺时针为负，范围为 $[-\pi,\pi]$。

### 基本运算

$$
(x_1,y_1) + (x_2,y_2)=(x_1+x_2,y_1+y_2)\\
  (x_1,y_1) - (x_2,y_2)=(x_1-x_2,y_1-y_2)\\
  (x,y) \times k=(xk,yk)\\
  (x,y) \div k = (x \div k, y \div k)
$$

将两个向量 $\overrightarrow{v_1}$ 和 $\overrightarrow{v_2}$ 相加，可以把 $\overrightarrow{v_2}$ 的起始点平移到 $\overrightarrow{v_1}$ 的结束点，然后 $(0,0)$ 到 平移后的 $\overrightarrow{v_2}$ 终点形成的新线段就是相加的结果。


| before                                                       | after                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://cdn.luogu.com.cn/upload/image_hosting/eux4n2bz.png) | ![](https://cdn.luogu.com.cn/upload/image_hosting/ujr2acx3.png) |

减法同加法类似，只是将 $\overrightarrow{v_2}$ 的**结束点**平移到 $\overrightarrow{v_1}$ 的结束点。

| before                                                       | after                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://cdn.luogu.com.cn/upload/image_hosting/eux4n2bz.png) | ![](https://cdn.luogu.com.cn/upload/image_hosting/ay235u7q.png) |

将一个向量乘或除以 $k$，表示将向量所对应的有向线段长度变为原来的 $k$ 倍或 $k$ 分之一。

为了使代码编写更加方便，我们定义一个新结构体 `Vec` 来表示向量。

```cpp
struct Vec { double x, y; };
Vec operator+ (Vec a, Vec b) { return {a.x + b.x, a.y + b.y}; }
Vec operator- (Vec a, Vec b) { return {a.x - b.x, a.y - b.y}; }
Vec operator* (Vec a, double b) { return {a.x * b, a.y * b}; }
Vec operator/ (Vec a, double b) { return {a.x / b, a.y / b}; }
double norm(Vec a) { return a.x * a.x + a.y * a.y; }
```

### 乘法

向量的乘法分为点乘（dot）和叉乘（det）。它们的运算结果都是一个**数**而不是向量。

#### 点乘

$$\overrightarrow{(x_1,y_1)} \cdot \overrightarrow{(x_2,y_2)} = x_1x_2+ y_1y_2$$

点乘的结果为两个向量的长度的积再乘以两个向量的夹角的余弦，即

$$\overrightarrow{v_1} \cdot \overrightarrow{v_2} = |\overrightarrow{v_1}| |\overrightarrow{v_2}| \cos\langle \overrightarrow{v_1}, \overrightarrow{v_2} \rangle$$

#### 叉乘

$$\overrightarrow{(x_1,y_1)} \times \overrightarrow{(x_2,y_2)} = x_1y_2- y_1x_2$$

点乘的结果为将 $\overrightarrow{v_2}$ 的起始点平移到 $\overrightarrow{v_1}$ 的结束点后以 $\overrightarrow{v_1}$ 与 $\overrightarrow{v_2}$ 为邻边的平行四边形的面积。

![](https://cdn.luogu.com.cn/upload/image_hosting/kjuaqlpp.png)

如果需要求以两向量为两边的三角形面积，可以求出平行四边形面积后除以二。

```cpp
double dot(Vec a, Vec b) { return a.x * b.x + a.y * b.y; }
double det(Vec a, Vec b) { return a.x * b.y - a.y * b.x; }
```

### 旋转

向量 $\overrightarrow{(x,y)}$ 绕原点逆时针旋转 $\alpha$ 弧度后变为 $\overrightarrow{(x\cos\alpha-y\sin\alpha, y\cos\alpha+x\sin\alpha)}$。

## 直线

直线可以用两个向量表示。直线上的任意两个不相交的点组成的两个向量，被称为这条直线的**方向向量**。

```cpp
struct Line { Vec a, b; };
```

### 直线和点的关系

如果点 $P$ 在直线 $AB$ 上，则以 $\overrightarrow{PA}$、$\overrightarrow{PB}$ 为邻边的平行四边形面积为零，即 $\overrightarrow{PA} \times \overrightarrow{PB}=0$。

```cpp
bool include(Line l, Vec p) { return fsame(det(l.a - p, l.b - p), 0); }
```

### 两直线的关系

#### 交点个数

- 如果一条直线上的两个点都在另一条实现上，则两条直线重合；
- 如果不重合的两条直线的方向向量组成的平行四边形面积为零，则两条直线平行。

```cpp
/*
  0 表示平行（无交点）
  1 表示相交（一个交点）
  -1 表示重合（无数个交点）
 */
int relation(Line a, Line b) {
  if (include(a, b.a) && include(a, b.b)) return -1;
  else if (fsame(det(a.b - a.a, b.b - b.a))) return 0;
  else return 1;
}
```

#### 交点坐标

// TODO

## 线段

### 线段与点的关系

// TODO

### 线段交点个数 / 交点坐标

求对应所在直线的交点，判断是否在线段上即可。

## 多边形

// TODO