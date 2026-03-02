---
title: "Git常用命令"
date: 2021-06-27T23:28:58+08:00
draft: false
tags: [Git]
categories: [Note]
---

### git log

git branch -v 查看本地有哪些分支

git log --oneline 更简洁查看git log

git log -n2 --oneline 查看最近两次log

git log  --oneline --all 查看所有的log

git log --oneline --graph 图形化查看log

git log  develop --graph 查看develop分支的log

### git rebase 的用法

参考： https://www.yiibai.com/git/git_rebase.html



### 开发分支改完合并到develop

开发分支：

git add .

git commit 

git push

git log 拿到commitHash

切换到develop：git checkout develop

更新develop：git pull

git cherry-pick <commitHash>



### 删除远程分支

```shell
git push origin --delete branchName
```



### 删除本地分支

```shell
git branch -d branchName
```



### 已经提交的commit，如何合并

前面有n个提交记录，比如n是6，你要把这六个提交记录合并成一个

```shell
git rebase -i HEAD~6
```

合并好之后，强制push到远程

```shell
git push -f
```



### 取消merge

```shell
git merge --abort
```



### 上线后的项目修改

方法一：

切换到master分支，新建一个分支

将开发分支的修改提交cherry-pick过来

方法二：

切换到master分支，新建一个分支，直接在新分支改



### 某仓库更改用户名邮箱

git config user.name "gitlab's Name"

git config user.email "gitlab@xx.com"

git config --list



### 撤销git add

git reset HEAD .

### 修改commit信息

git commit --amend -m "an updated commit message"

### 撤销commit

git reset --soft HEAD^   （HEAD^的意思是上一个版本，也可以写成HEAD~1，如果你进行了2次commit，想都撤回，可以使用HEAD~2）

### vim模式编辑 

那如何操作vim编辑器(这里只简单介绍 一下)：

1. 按下字母键`i`或`a`或`o`，此时进入到可编辑状态，这时就可以输入你的注释
2. 当你输入完之后，按下`Esc`键就可退出编辑状态，回到一般模式。
3. 最后就是怎么退出vim编辑器并提交commit， 有两种方法：
   - 输入两字大写字母`ZZ`（记住是大写）
   - 输入`:wq`或`:wq!`(强行退出)



### commit之后撤销某个文件夹下的提交

先撤销commit： git reset --soft HEAD^

然后进入那个你不想回退的文件夹： git reset HEAD .

这样就只有那个文件夹下的文件没有跟踪，再git add 之后commit就行了



### 开发流程

feature分支开发，日常用git pull origin master:master拉取主干代码

开发完成，转到develop分支，git pull之后用git merge --squash feature/xxx 合并

修改，就用git cherry-pick 或者 git merge feature/xxx进行代码合并

要合并到master的时候：

git pull origin master:master

git rebase master

git rebase -i master
