# Datadog Browser Agent

The browser agent is used to collect logs and RUM data from the browser.
It's bundled into four files which are distributed through Cloudfront:

- `https://www.datadoghq-browser-agent.com/datadog-logs-(eu|us).js`
- `https://www.datadoghq-browser-agent.com/datadog-rum-(eu|us).js`

## The `logs` bundle

It contains everything needed to send logs. When loaded, it exposes a `window.DD_LOGS` that
contains all the public APIs.

### Typical use

```
<script src = 'https://www.datadoghq-browser-agent.com/datadog-logs-us.js'>
<script>
    window.DD_LOGS.init({
        clientToken: 'XXX',
        forwardErrorsToLogs: true,
    });
</script>
```

### API exposed in `window.DD_LOGS`

What we call `Context` is a map `{key: value}` that will be added to the message context.

- Init must be called before other methods. Configurable options:

  - `isCollectingError`: when truthy, we'll automatically forward `console.error` logs, uncaught exceptions and network errors.

  ```
  init(configuration: {
      clientToken: string,
      isCollectingError?: boolean,
  })
  ```

- Default logger

  ```
  logger.debug | info | warn | error (message: string, messageContext = Context)`
  logger.log (message: string, messageContext: Context, status? = 'debug' | 'info' | 'warn' | 'error')
  logger.setLevel (level?: 'debug' | 'info' | 'warn' | 'error')
  logger.setHandler (handler?: 'http' | 'console' | 'silent')
  logger.addContext (key: string, value: any)  # add one key-value to the logger context
  logger.setContext (context: Context)  # entirely replace the logger context
  ```

- Custom loggers

  Custom loggers have the same API than the default logger

  ```
  createLogger (name: string, conf?: {
      level?: 'debug' | 'info' | 'warn' | 'error'
      handler?: 'http' | 'console' | 'silent'
      context?: Context
  })  # create a new logger
  getLogger (name: string)  # retrieve a previously created logger
  ```

- Modify the global context for all loggers
  ```
  addLoggerGlobalContext (key: string, value: any)  # add one key-value to the default context
  setLoggerGlobalContext (context: Context)  # entirely replace the default context
  ```

## The `rum` bundle

It contains everything related to RUM stuff. When loaded, it exposes a `window.DD_RUM` that
contains all the public APIs.

### Typical use

```
<script src = 'https://www.datadoghq-browser-agent.com/datadog-rum-us.js'>
<script>
    window.DD_RUM.init({
        clientToken: 'XXX',
        applicationId: 'XXX',
    });
</script>
```

### API exposed in `window.DD_RUM`

Right now, we don't expose any features to customize the RUM collection.
This may change at some point.

## Deploy

### Staging

Each commit on `master` branch is deployed to staging:

`https://www.datad0g-browser-agent.com/datadog-(logs|rum)-(eu|us).js`

### Prod

Each commit on `prod` branch is deployed to prod:

`https://www.datadoghq-browser-agent.com/datadog-(logs|rum)-(eu|us).js`
