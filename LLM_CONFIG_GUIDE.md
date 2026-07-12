# LLM Configuration System Guide

## Overview

The LLM Configuration System allows you to integrate **any LLM from any provider** into the Multi Meta Matrix platform. This comprehensive system provides:

- **9 Pre-configured Providers**: OpenAI, Anthropic, Google, Groq, Ollama, Together AI, Replicate, Azure OpenAI, Hugging Face
- **Custom Provider Support**: Connect to any LLM API endpoint
- **Provider-specific Parameters**: Temperature, Top P, Top K, Max Tokens, and more
- **Connection Testing**: Verify credentials before using configurations
- **Agent-level Customization**: Override LLM settings per agent
- **Secure Credential Management**: API keys stored securely (encrypted in production)

---

## Supported Providers

### 1. OpenAI
- **Models**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- **Required**: API Key
- **Documentation**: https://platform.openai.com/docs

### 2. Anthropic (Claude)
- **Models**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Required**: API Key
- **Documentation**: https://docs.anthropic.com

### 3. Google (Gemini)
- **Models**: Gemini Pro, Gemini Pro Vision, PaLM 2
- **Required**: API Key
- **Documentation**: https://ai.google.dev

### 4. Groq (Fast Inference)
- **Models**: LLaMA 2 70B, Mixtral 8x7B, Gemma 7B
- **Required**: API Key
- **Documentation**: https://console.groq.com/docs

### 5. Ollama (Local)
- **Models**: LLaMA 2, Mistral, Neural Chat, Starling LM
- **Required**: Custom Endpoint (default: http://localhost:11434)
- **Documentation**: https://github.com/ollama/ollama

### 6. Together AI
- **Models**: LLaMA 2 70B, Mistral 7B, Phi 2
- **Required**: API Key
- **Documentation**: https://docs.together.ai

### 7. Replicate
- **Models**: LLaMA 2 70B, Mistral 7B, Falcon 7B
- **Required**: API Key
- **Documentation**: https://replicate.com/docs

### 8. Azure OpenAI
- **Models**: GPT-4, GPT-3.5 Turbo
- **Required**: API Key + API Endpoint
- **Documentation**: https://learn.microsoft.com/en-us/azure/ai-services/openai/

### 9. Hugging Face
- **Models**: 150,000+ models on Hugging Face Hub
- **Required**: API Key
- **Documentation**: https://huggingface.co/docs/api-inference

### 10. Custom Provider
- **Models**: Any custom LLM API
- **Required**: Custom Endpoint + API Key
- **Use Case**: Private LLM servers, enterprise deployments, custom infrastructure

---

## Getting Started

### Step 1: Access LLM Configuration
1. Click **"LLM Config"** in the sidebar
2. Click **"Add Configuration"** button
3. Select your preferred provider

### Step 2: Configure Provider Credentials
Each provider has different requirements:

#### OpenAI Example
```
Configuration Name: My OpenAI Setup
Provider: OpenAI
API Key: sk-...
Temperature: 0.7
Max Tokens: 2048
```

#### Ollama Example (Local)
```
Configuration Name: Local Ollama
Provider: Ollama
Custom Endpoint: http://localhost:11434
Temperature: 0.7
Max Tokens: 2048
```

#### Azure Example
```
Configuration Name: Azure Production
Provider: Azure OpenAI
API Key: your-azure-key
API Endpoint: https://your-resource.openai.azure.com/
Temperature: 0.7
Max Tokens: 2048
```

### Step 3: Test Connection
1. After saving configuration, click **"Test"** button
2. System validates credentials and connectivity
3. Green indicator = Ready to use
4. Red indicator = Connection failed

---

## Advanced Parameters

### Temperature (0.0 - 2.0)
- **Lower (0.0-0.7)**: More focused, deterministic responses
- **Higher (0.7-2.0)**: More creative, diverse responses
- **Default**: 0.7

### Top P (0.0 - 1.0)
- Controls diversity through nucleus sampling
- **Lower values**: More focused on likely tokens
- **Higher values**: More diversity
- **Default**: 1.0

### Top K (Integer)
- Limits to top K most likely tokens
- **0**: Disabled
- **Common values**: 40-100
- **Default**: 0

### Max Tokens (256 - 32000)
- Maximum output length per request
- **Lower**: Faster, cheaper responses
- **Higher**: More detailed responses
- **Default**: 2048

### Frequency Penalty (-2.0 - 2.0)
- Penalizes repeated tokens
- **Positive values**: Encourage diversity
- **Negative values**: Allow repetition
- **Default**: 0

### Presence Penalty (-2.0 - 2.0)
- Penalizes tokens already in the prompt
- **Positive values**: Encourage new tokens
- **Negative values**: Allow repeating prompt tokens
- **Default**: 0

---

## Using LLM Configurations in Agents

### 1. Create an Agent
1. Click **"Agents"** in sidebar
2. Click **"Add Agent"** or use Agent Builder
3. Fill in basic information (name, role, etc.)

### 2. Configure LLM Settings
1. Go to **"LLM Settings"** tab
2. Select an LLM Configuration from dropdown
3. (Optional) Override default model from the config
4. Add System Prompt for agent behavior

### 3. Customize per Agent
- Override temperature for this agent
- Override max tokens for specific use case
- Add custom system instructions

### 4. Save Agent
Agent now uses the selected LLM configuration with your customizations

---

## System Prompt Examples

### Research Agent
```
You are an expert research assistant. Your task is to:
1. Search for current, accurate information
2. Verify facts from multiple sources
3. Provide comprehensive, cited responses
4. Identify knowledge gaps and uncertainties
5. Suggest follow-up research areas

Always cite your sources and acknowledge limitations.
```

### Code Review Agent
```
You are an expert code reviewer. Analyze code for:
1. Security vulnerabilities
2. Performance issues
3. Code quality and maintainability
4. Best practices violations
5. Testing coverage gaps

Provide actionable feedback with specific improvements.
```

### Customer Service Agent
```
You are a helpful customer service representative. 
- Be empathetic and professional
- Resolve issues quickly
- Escalate complex problems appropriately
- Follow company policies and guidelines
- Document interactions clearly

Always prioritize customer satisfaction.
```

---

## Best Practices

### 1. Configuration Management
- Create separate configs for different use cases
- Use descriptive names (e.g., "Production GPT-4", "Testing GPT-3.5")
- Test connections regularly
- Monitor API usage and costs

### 2. Parameter Tuning
- Start with default values
- Adjust temperature first for creative/focused balance
- Use max_tokens to control costs
- Document your tuning decisions

### 3. Provider Selection
- **OpenAI**: Best general-purpose, most capable
- **Anthropic**: Great for reasoning, long context
- **Groq**: Best speed/cost ratio
- **Ollama**: Privacy, no API costs
- **Google**: Multimodal capabilities

### 4. Security
- Never commit API keys to version control
- Use environment variables for credentials
- Rotate keys regularly
- Monitor API access logs
- Use dedicated API keys per service/environment

### 5. Cost Optimization
- Use cheaper models for simple tasks
- Batch similar requests
- Set reasonable max_tokens limits
- Monitor usage per agent
- Use Groq for high-volume inference

---

## Troubleshooting

### Connection Test Failed
1. Verify API key is correct
2. Check endpoint URL for custom providers
3. Ensure API account is active
4. Check rate limits haven't been exceeded
5. Verify network connectivity

### Agent Response Issues
1. Check system prompt - may be conflicting with task
2. Verify temperature isn't too low (0) or high (2)
3. Increase max_tokens if responses seem cut off
4. Try different LLM provider
5. Test connection again

### High Costs
1. Monitor token usage
2. Reduce max_tokens setting
3. Switch to cheaper model variant
4. Use Groq for high-volume tasks
5. Batch similar requests

### Slow Responses
1. Switch to Groq for faster inference
2. Use smaller model variant
3. Reduce max_tokens
4. Check network latency
5. Monitor API service status

---

## API Reference

### useLLMConfigStore

```typescript
// Get all configurations
const { configs } = useLLMConfigStore();

// Add new configuration
useLLMConfigStore.getState().addConfig(config);

// Update configuration
useLLMConfigStore.getState().updateConfig(id, updates);

// Delete configuration
useLLMConfigStore.getState().deleteConfig(id);

// Test connection
await useLLMConfigStore.getState().testConnection(id);

// Get specific configuration
const config = useLLMConfigStore.getState().getConfig(id);

// Get configs by provider
const openaiConfigs = useLLMConfigStore.getState()
  .getConfigsByProvider('openai');

// Duplicate configuration
useLLMConfigStore.getState().duplicateConfig(id);
```

---

## Integration with Other Systems

### With Skills
- Use LLM configs when creating skill execution plans
- Different skills may need different LLMs

### With Swarms
- Assign different LLMs to different agents in swarm
- Balance cost vs capability

### With Memory
- LLM config affects how agents learn and retrieve memory
- Different models process context differently

### With Integrations
- Combine with GitHub import for code analysis
- Use with web scraping for research tasks

---

## Migration Guide

### From Static Model Selection
If you previously hardcoded models:

**Before:**
```typescript
const model = 'gpt-4';
```

**After:**
```typescript
const config = useLLMConfigStore.getState().getConfig(configId);
const model = config.defaultModel;
```

### Updating Existing Agents
1. Create LLM configurations for your preferred providers
2. Update agents to reference configs
3. Test thoroughly before deploying
4. Keep old configurations as fallback

---

## Support & Resources

- **Documentation**: [See Provider Links Above]
- **API Pricing**: Check individual provider pricing pages
- **Rate Limits**: Varies by provider - see documentation
- **Support**: Contact respective provider support

---

## Example Configurations

### Quick Start - OpenAI GPT-4
```json
{
  "name": "GPT-4 Standard",
  "provider": "openai",
  "apiKey": "sk-...",
  "defaultModel": "gpt-4",
  "temperature": 0.7,
  "maxTokens": 2048
}
```

### Budget Option - Groq Mixtral
```json
{
  "name": "Groq Fast & Cheap",
  "provider": "groq",
  "apiKey": "your-groq-key",
  "defaultModel": "mixtral-8x7b",
  "temperature": 0.5,
  "maxTokens": 2048
}
```

### Privacy - Local Ollama
```json
{
  "name": "Local LLaMA 2",
  "provider": "ollama",
  "customEndpoint": "http://localhost:11434",
  "defaultModel": "llama2",
  "temperature": 0.7,
  "maxTokens": 2048
}
```

### Enterprise - Azure OpenAI
```json
{
  "name": "Azure Production",
  "provider": "azure",
  "apiKey": "azure-key",
  "apiEndpoint": "https://resource.openai.azure.com/",
  "defaultModel": "gpt-4",
  "temperature": 0.5,
  "maxTokens": 4096
}
```

---

## What's Next?

1. Create your first LLM configuration
2. Test the connection
3. Create an agent using that config
4. Start a conversation to test it
5. Fine-tune parameters based on results

Happy prompting! 🚀
