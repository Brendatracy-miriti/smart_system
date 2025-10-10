fix(ui/statcard): render icon correctly to avoid React child error

Ensure icon prop is rendered safely whether it's a React element or a component constructor.
Prevent passing raw component objects as children (fixes "Objects are not valid as a React child" runtime error).