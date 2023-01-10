# The Command Line Interface

The CLI provided by main.cjs is fairly simple. This should change in the future
but this should work for automatic grading of DLX programs.

Call the program like this: `node main.cjs <program_file_name>`.

Then submit json encoded options via stdin. Currently, these can be multi-line,
but MUST end with closing the stdin stream. In an interactive shell, this
is usually done by pressing <kbd>CTRL + D</kbd>. These options can be:

~~~jsonc
{
  "registers": [...], // List containing register prefill instructions
  "memory": [...], // List containing memory prefill instructions
  "dump": [...] // what contents to dump at the end of the execution (for example for later grading)
}
~~~

Missing options will be interpreted as the empty list.

The register/memory prefill instructions are two-element lists consisting of first
the "target", then the value. The target value should be in a format understood
by `DLX.writeRegister` / `DLX.writeAddress` from `script.cjs`. This usually means
that the notation from the assembler is accepted. The instructions are executed
in order with first the registers set, then the memory being filled.

Memory and registers are always initialized to `0` unless otherwise specified.

`dump` controls which things will be dumped at the end of the execution. These can
be `"memory", "registers"` to dump all of memory / all registers. These can be combined.
The data will be serialized using json. As other output may be produced during
program execution, this will be prepended by the string `<-abc-xyz-123->` and a
newline. In the future it might be possible to selectively dump specific registers
or memory locations. The format will be:

~~~jsonc
{
"registers": [...], // Values of the 32 registers. 
                    // If a register was never touched, this will be `null`
   "memory": [...]  // Values of the 256 memory cells.
                    // If a memory location was never touched, this will be `null`
}
~~~

Memory locations start at `1000`. This is currently non-configurable.
