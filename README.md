# AI Commit Message Generator for VS Code 🤖✨

[![VS Marketplace](https://img.shields.io/visual-studio-marketplace/v/Its-Satyajit.ai-commit-messege?color=blue&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=Its-Satyajit.ai-commit-messege)
[![Open VSX](https://img.shields.io/open-vsx/v/Its-Satyajit/ai-commit-messege?color=purple&logo=open-vsx)](https://open-vsx.org/extension/Its-Satyajit/ai-commit-messege)
[![License](https://img.shields.io/github/license/Its-Satyajit/ai-commit-messege?color=green)](LICENSE)

**AI-powered Conventional Commit generation** - Transform code diffs into
meaningful commit messages using local AI models. Optimized for both legacy and
modern hardware.

<figure text-align="center">

<img src="public/a.png" alt="Workflow Demo" width="400" >
<figcaption  text-align="center">The full thinking process is not visible here but is available in the output channel</figcaption>
 </figure>

## Features 🌟

- **Local AI Processing**
- **Support both OpenAI and Ollama**
- **Hardware-Aware Optimization**
- **Commit Standard Compliance**
- **GPU Acceleration Support**
- **Multi-Model Compatibility**
- **No Dependencies**
- **Streaming Support**
- **Model Deep Thinking Supported**

## Installation

```bash
# VS Code Marketplace
code --install-extension Its-Satyajit.ai-commit-messege
```

## Hardware Requirements 🖥️

### Minimum Specifications

```yaml
CPU: Intel i5-6300U (2015) / AMD Ryzen 3 2200G
RAM: 8GiB DDR4
Storage: SATA SSD
GPU: Optional (See acceleration section)
```

### Recommended Specifications

```yaml
CPU: AMD Ryzen 7 5800X (8c/16t)
RAM: 32GiB DDR4-3200
Storage: PCIe 4.0 NVMe SSD
GPU: NVIDIA RTX 3060 12GiB
```

## Model Specifications

| Model                          | Parameters | Quantization | Size  | VRAM Required |
| ------------------------------ | ---------- | ------------ | ----- | ------------- |
| `deepseek-r1:8b` (Ollama)      | 8.03B      | Q4_K_M       | 4.9GiB | 3.4GiB         |
| `deepseek-r1-distill-llama-8b` | 8B         | Q4_K_M       | 4.6GiB | 3.1GiB         |

## Configuration

### 1. AI Backend Setup

**Ollama (Recommended for Beginners)**

```bash
# Install with GPU support
curl -fsSL https://ollama.com/install.sh | sh
OLLAMA_GPU_LAYER=1 ollama serve

# Model setup
ollama pull deepseek-r1:8b
```

see [Ollama](https://ollama.com/) for more details

**LM Studio (Advanced Users)**

```bash
# Start server with GPU offloading
lmstudio serve --model deepseek-r1-distill-llama-8b.gguf \
  --gpulayers 20 \
  --contextsize 4096 \
  --usemlock
```

see [LM Studio](https://lmstudio.ai/) for more details

### 2. Extension Settings

```json
{
  "commitMessageGenerator.provider": "openai",
  "commitMessageGenerator.model": "deepseek-r1-distill-llama-8b",
  "commitMessageGenerator.temperature": 0.7,
  "commitMessageGenerator.maxTokens": 4096,
  "commitMessageGenerator.apiKey": "your_api_key",
  "commitMessageGenerator.types": [ "feat: A new feature", ... ], // <type>: <description>
  "commitMessageGenerator.scopes": [ "api", "ui", ... ]
}
```

## Hardware Performance Guide

### Legacy System Profile (Test Environment)

This is the only system I use for testing purposes.

```yaml
OS: openSUSE Tumbleweed
Host: Dell G3 3579
Kernel: Linux 6.13.0-1-default
CPU: Intel i7-8750H (6 cores, 12 threads, up to 4.10 GHz)
GPU: NVIDIA GTX 1050 Ti Mobile, Intel UHD Graphics 630
RAM: 16 GiB DDR4
Swap: 7.73 GiB (32%) (Z-RAM)
Storage: 119.23 GiB (btrfs) + 310.46 GiB (fuseblk) + 310.46 GiB (fuseblk) + 310.46 GiB (fuseblk)
Display: 1920x1080 @ 60 Hz (Built-in 16")
DE: KDE Plasma 6.2.5
Shell: zsh 5.9
WM: KWin (Wayland)
```

### Performance Metrics

| Metric              | CPU Only | GPU Accelerated | Improvement |
| ------------------- | -------- | --------------- | ----------- |
| First Token Latency | 42s      | 28s             | 33% ↓       |
| Tokens/Second       | 1.8 t/s  | 3.1 t/s         | 72% ↑       |
| Memory Usage        | 6.8GiB    | 4.1GiB           | 40% ↓       |
| Energy Consumption  | 45W      | 58W             | 29% ↑       |

### Modern Hardware Comparison

| Component        | GTX 1050 Ti (2016) | RTX 3060 (2021) | RTX 4090 (2024) |
| ---------------- | ------------------ | --------------- | --------------- |
| VRAM             | 4GiB GDDR5          | 12GiB GDDR6      | 24GiB GDDR6X     |
| FP16 Performance | 1.8 TFLOPS         | 12.7 TFLOPS     | 82.6 TFLOPS     |
| Tokens/sec       | 3.1 t/s            | 28 t/s          | 85 t/s          |

## GPU Optimization

### NVIDIA Pascal (GTX 10-Series)

```bash
# Optimal Settings
export OLLAMA_GPUS=1
export GGML_CUDA_OFFLOAD=20
export CUDA_VISIBLE_DEVICES=0

# Memory Allocation Strategy
┌───────────────────────┐           ┌──────────────────────┐
│       CPU RAM         │           │     GPU VRAM         │
│ 16GiB DDR4            │           │ 4GiB GDDR5           │
├───────────────────────┤ ⟵mmap⟶    ├──────────────────────┤
│ Model Weights (2.1GiB)│           │  Offloaded Layers    │
│ Activations (1.2GiB)  │           │ (20 layers @ 140MB)  │
└───────────────────────┘           └──────────────────────┘
```

### Configuration Tips

```json
{
  "commitMessageGenerator.gpuLayers": 20,
  "commitMessageGenerator.vulkanSupport": true,
  "commitMessageGenerator.memoryMapping": "partial",
  "commitMessageGenerator.cudaThreads": 512
}
```

## Troubleshooting 🔧

### Common Issues

| Symptom                | Solution                 | Emergency Override      |
| ---------------------- | ------------------------ | ----------------------- |
| CUDA Out of Memory     | Reduce GPU layers by 2-4 | `--gpulayers 16`        |
| Slow Token Generation  | Enable `--no-mmap`       | `--threads <CPU_CORES>` |
| Model Loading Failures | Verify SHA256 checksums  | `--force-download`      |
| Vulkan Initialization  | Update to Nvidia 535+    | `--disable-vulkan`      |

### Performance Checklist

1. Verify GPU driver compatibility
2. Monitor VRAM usage with `nvidia-smi`
3. Check CPU/GPU temperature thresholds
4. Validate model quantization matches hardware
5. Ensure proper cooling system operation

## FAQ ❓

**Q: Why use local AI instead of cloud services?**<br> A: Privacy, offline
access, and no API costs. Local processing ensures your code never leaves your
machine.

**Q: Minimum hardware for usable performance?**<br> A: 4-core CPU (2015+), 8GiB
RAM, SSD. Expect 2-3 tokens/sec.

**Q: Can I use AMD GPUs?**<br> A: Yes via ROCm/Vulkan, but performance varies.
NVIDIA GPUs recommended.

**Q: How to reduce memory usage?**<br> A: Use `--gpulayers 12` and Q2_K
quantization (trade quality for efficiency).

## Contributing 🤝

We welcome contributions! Please review our:

```bash
# Build from Source
git clone https://github.com/Its-Satyajit/ai-commit-messege
cd ai-commit-messege
npm install
npm run package
```

## License 📄

MIT License - [Full Text](LICENSE)

---

**Optimized for Reality** - From legacy laptops to cutting-edge workstations.
🖥️➡️🚀

[Report Issue](https://github.com/Its-Satyajit/ai-commit-messege/issues)
