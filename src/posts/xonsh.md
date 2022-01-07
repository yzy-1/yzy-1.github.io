---
title: Python + Shell = ? | Xonsh 入门
tags: ["linux"]
uptime: 1638020195
---

## 前言

各位在书写 shell 脚本时有没有遇到过这些不称心之处：

- bash：语法繁琐，就算个 `1+1` 也要写成 `((1+1))` 或者借助外部程序 `bc` 写成 `'1+1' | bc` 这种丑陋的东西。且不适合作为交互 shell 来使用。
- zsh：语法方面同 bash。
- fish：语法方面各种参数乱飞，就拿用来定义变量的 `set` 来说吧，就有 `-x`、`-g`、`-a`、`-e` 等各种参数，用来写脚本可读性也不是很高。

这时候，我们就希望能借用高级语言中的一些语法到 shell 中来，这会大大提高脚本的可读性和编写代码时的速度。为了解决这个问题，Xonsh 就诞生了。~~你说 powershell？这东西又臭又长的大驼峰、全名称命名法，就让人没有使用它的想法。~~

## 什么是 Xonsh？

> The xonsh shell lets you easily mix Python and shell commands in a powerful and simplified approach to the command line.

一句话：Xonsh = Python + shell。

Xonsh 是 shell，它兼容一部分常用 bash 语法，如：

$$
\def\ba{\begin{aligned}\dollar}
\def\ab{\end{aligned}\\}
\newcommand{\B}[1]{{\texttt{#1}}}
\def\kw{\textcolor{#FFAE57}}
\def\st{\textcolor{#BBE67E}}
\def\dollar{\textcolor{#5CCFE6}{\texttt{\$}}\ }
\color{#D9D7CE}\colorbox{#212733}{
$\begin{array}{ll}
\ba&\B{\kw{cd} home}\ab\\
\ba&\B{\kw{cat} /etc/passwd | \kw{grep} root}\ab\\
\ba&\B{\kw{ls} -la}\ab
\end{array}$
}\color{transparent}{\$}
$$

Xonsh 是 Python，它是 Python 3.6+ 的超集，也就是说你可以使用 Python 语言中的 import 等高级语法，如：

$$
\def\ba{\begin{aligned}\dollar}
\def\ab{\end{aligned}\\}
\newcommand{\B}[1]{{\texttt{#1}}}
\def\kw{\textcolor{#FFAE57}}
\def\st{\textcolor{#BBE67E}}
\def\co{\textcolor{#D4BFFF}}
\def\lxl{{\texttt{\$}}}
\def\dollar{\textcolor{#5CCFE6}\lxl\ }
\color{#D9D7CE}\colorbox{#212733}{
$\begin{array}{ll}
\ba&\B{\co2 + \co2}\ab\\
\ba
&\B{\kw{import} json}\\[-0.5em]
&\B{j = json.loads(\st{'\{"Hello": "world!", "Answer": 42\}'})}\\[-0.5em]
&\B{print(j[\st{'Answer'}])}\\[-0.5em]
\ab
\end{array}$
}\color{transparent}{\$}
$$

Xonsh 是 Python 中的 shell。在 Xonsh 里，你可以将 Python 与 shell 命令结合使用，如：

$$
\def\ba{\begin{aligned}\dollar}
\def\ab{\end{aligned}\\}
\newcommand{\B}[1]{{\texttt{#1}}}
\def\kw{\textcolor{#FFAE57}}
\def\st{\textcolor{#BBE67E}}
\def\co{\textcolor{#D4BFFF}}
\def\op{\textcolor{#80D4FF}}
\def\lxl{{\texttt{\$}}}
\def\dollar{\textcolor{#5CCFE6}\lxl\ }
\color{#D9D7CE}\colorbox{#212733}{
$\begin{array}{ll}
\ba&\B{len(\op{\lxl(}\kw{curl} -L https://xon.sh\op{)})}\ab\\
\ba
&\B{\kw{for} filename \kw{in} \st{'.*'}:}\\[-0.5em]
&\B{\quad print(filename)}\\[-0.5em]
&\B{\quad \kw{du} -sh \op{@(}filename\op)}\\[-0.5em]
\ab
\end{array}$
}\color{transparent}{\$}
$$

Xonsh 是 shell 中的 Python。你可以在 Python 中创建一些变量和参数，然后在 shell 命令中使用它们，如：

$$
\def\ba{\begin{aligned}\dollar}
\def\ab{\end{aligned}\\}
\newcommand{\B}[1]{{\texttt{#1}}}
\def\kw{\textcolor{#FFAE57}}
\def\st{\textcolor{#BBE67E}}
\def\co{\textcolor{#D4BFFF}}
\def\op{\textcolor{#80D4FF}}
\def\lxl{{\texttt{\$}}}
\def\dollar{\textcolor{#5CCFE6}\lxl\ }
\color{#D9D7CE}\colorbox{#212733}{
$\begin{array}{ll}
\ba&\B{var = \st{'he'} + \st{'llo'}}\ab\\
\ba&\B{\kw{echo} \op{@(}var\op) > tmp/\op{@(}var\op)}\ab\\
\ba&\B{\kw{echo} \op{@(}i \kw{for} i \kw{in} range(\co{42})\op)}\ab
\end{array}$
}\color{transparent}{\$}
$$

总结来说：Xonsh 是一个能让你感觉舒适的 Shell。

## 安装

要安装 Xonsh 非常简单，你可以直接使用 `pip` 安装它：

$$
\def\ba{\begin{aligned}\dollar}
\def\ab{\end{aligned}\\}
\newcommand{\B}[1]{{\texttt{#1}}}
\def\kw{\textcolor{#FFAE57}}
\def\st{\textcolor{#BBE67E}}
\def\co{\textcolor{#D4BFFF}}
\def\op{\textcolor{#80D4FF}}
\def\lxl{{\texttt{\$}}}
\def\dollar{\textcolor{#5CCFE6}\lxl\ }
\color{#D9D7CE}\colorbox{#212733}{
$\begin{array}{ll}
\ba&\B{\kw{python3} -m pip install 'xonsh[full]'}\ab
\end{array}$
}\color{transparent}{\$}
$$

如果你在用 arch 系的操作系统，也可以使用 `pacman`：

$$
\def\ba{\begin{aligned}\dollar}
\def\ab{\end{aligned}\\}
\newcommand{\B}[1]{{\texttt{#1}}}
\def\kw{\textcolor{#FFAE57}}
\def\st{\textcolor{#BBE67E}}
\def\co{\textcolor{#D4BFFF}}
\def\op{\textcolor{#80D4FF}}
\def\lxl{{\texttt{\$}}}
\def\dollar{\textcolor{#5CCFE6}\lxl\ }
\color{#D9D7CE}\colorbox{#212733}{
$\begin{array}{ll}
\ba&\B{\kw{pacman} -S xonsh}\ab
\end{array}$
}\color{transparent}{\$}
$$

安装完成后，你可以将其设置为默认 Shell：

$$
\def\ba{\begin{aligned}\dollar}
\def\ab{\end{aligned}\\}
\newcommand{\B}[1]{{\texttt{#1}}}
\def\kw{\textcolor{#FFAE57}}
\def\st{\textcolor{#BBE67E}}
\def\co{\textcolor{#D4BFFF}}
\def\op{\textcolor{#80D4FF}}
\def\lxl{{\texttt{\$}}}
\def\dollar{\textcolor{#5CCFE6}\lxl\ }
\color{#D9D7CE}\colorbox{#212733}{
$\begin{array}{ll}
\ba&\B{\kw{chsh} -s /usr/bin/xonsh}\ab
\end{array}$
}\color{transparent}{\$}
$$
