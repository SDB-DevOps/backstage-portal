# SDB Backstage Internal Developer Platform (IDP)

Welcome to the enterprise **Backstage IDP Portal** repository for SDB DevOps Platform Engineering.

This monorepo contains the customizable frontend, backend, internal plugins, dynamic plugins configuration, self-service Scaffolder templates, and CI/CD pipelines.

---

## 🌟 仓库定位与核心架构

| 模块 | 路径 | 描述 |
| :--- | :--- | :--- |
| **Frontend App** | `packages/app/` | 基于 React + TypeScript 的 Backstage 单页应用，包含自定义导航、Catalog 仪表盘与 ArgoCD 状态卡片。 |
| **Backend App** | `packages/backend/` | 基于 Node.js + Express 的后端服务，托管 Catalog、Scaffolder、Auth、TechDocs、Proxy 以及 ArgoCD 插件。 |
| **Custom Plugins** | `plugins/` | 自研企业主题 (`custom-theme`) 与内部运维插件。 |
| **Scaffolder Templates** | `scaffolder-templates/` | 开箱即用的自助服务模板，包含 GCP Cloud Storage 存储桶申请模板与 Node.js 微服务骨架。 |
| **Deployment Manifests** | `deploy/` | Backstage 本身在 Kubernetes/K3s 下的部署清单，以及 ArgoCD Application 声明。 |
| **CI/CD Workflows** | `.github/workflows/` | GitHub Actions 自动化编译测试、Docker 镜像构建与 GitOps 自动晋级同步。 |

---

## ❓ 常见问题：这个仓库也需要通过 GitOps 连接 ArgoCD 吗？

> **答：Backstage 本身的 Kubernetes 部署清单需要通过 GitOps 配置仓库 (`crossplane-infra`) 接入 ArgoCD，而不需要让 ArgoCD 直接连接此源码仓。同时，Backstage 作为前台门户，主动集成调用 ArgoCD 的 API。**

### 关系总览表：

1. **源码仓与配置仓解耦**：
   - 本仓库 (`backstage-portal`) 存放 TypeScript/React 源码，由 **CI (GitHub Actions)** 进行编译并打包镜像（如 `ghcr.io/sdb-devops/backstage-portal:v1.0.0`）。
   - GitOps 仓库 (`crossplane-infra`) 存放最终部署 YAML 清单，由 **ArgoCD** 监听并负责自动化滚动发布。
2. **Backstage 前端集成 ArgoCD**：
   - Backstage UI 通过安装 `@janus-idp/backstage-plugin-argocd`，直连集群内 `argocd-server`。
   - 开发者在 Backstage 的服务画像卡片上即可直观查看微服务的健康度（Healthy/Degraded）和同步状态（Synced/OutOfSync），无须切换跳转到 ArgoCD 控制台。

完整解析请参阅：[docs/GITOPS_ARGOCD_INTEGRATION_GUIDE.md](./docs/GITOPS_ARGOCD_INTEGRATION_GUIDE.md)。

---

## 🚀 本地开发快速上手

### 环境要求
- Node.js `20.x`
- Yarn `1.22.x`
- Docker (用于 TechDocs 构建与容器化测试)

### 快速启动
```bash
# 1. 安装依赖
yarn install

# 2. 启动前端与后端 (并行运行在 3000 与 7007 端口)
yarn dev
```

启动完成后即可在浏览器访问：`http://localhost:3000`

---

## 📦 容器构建与部署

### 构建生产镜像
```bash
docker build -t ghcr.io/sdb-devops/backstage-portal:latest .
```

### 集群部署清单位置
- Base RBAC: `deploy/kubernetes/01-base-rbac.yaml`
- PostgreSQL: `deploy/kubernetes/02-postgres.yaml`
- ConfigMap: `deploy/kubernetes/03-backstage-config.yaml`
- Deployment & Service: `deploy/kubernetes/04-backstage-deployment.yaml`
- ArgoCD Application: `deploy/argocd/backstage-application.yaml`
