# Embedded Software Engineering — A Free, Emulator-First Syllabus

A staged course for becoming an embedded **software** engineer. Every resource is free.
Nothing here needs a development board — the hands-on work runs in **Renode**, **QEMU**
and **Wokwi**. Buy hardware later if you want to; the syllabus does not wait for it.

Each stage ends with a **project gate**. Do not move on until you have built it.

---

## How to use this

- Work the stages in order. Stages 0–6 are the core; the tracks at the end are electives.
- Inside a stage, resources are ordered **beginner-friendly first, deep references last**.
- `[beginner]` marks an easy entry point. `[reference]` marks a canonical deep source —
  do not try to read those end to end on the first pass, come back to them.
- `[alt]` covers the **same ground** as an unmarked item above it - a different
  teacher for the same lesson. Pick whichever suits you and skip the rest. Working
  through all of them is the easiest way to spend a month learning one thing.
- `[extra]` is optional depth. Skip it on the first pass; come back when a real
  problem sends you looking.
- So: the **unmarked items plus the project gate are the course**. Everything else is
  a substitute or a sidetrack.
- The **Reference Shelf** at the end is deliberately outside the stages: self-contained
  subjects, vendor catalogues and link galleries. Ignore it until something sends you there.
- Skipping Stage 2 is the most common mistake. Do not.

---

- [Stage 0 — Orientation & Your Emulated Lab](#stage-0-orientation-your-emulated-lab)
- [Stage 1 — C for Embedded Systems](#stage-1-c-for-embedded-systems)
- [Stage 2 — Toolchain, Build System & Debugging](#stage-2-toolchain-build-system-debugging)
- [Stage 3 — Bare-Metal Microcontroller Programming](#stage-3-bare-metal-microcontroller-programming)
- [Stage 4 — Buses, Protocols & Connectivity](#stage-4-buses-protocols-connectivity)
- [Stage 5 — RTOS & Firmware Architecture](#stage-5-rtos-firmware-architecture)
- [Stage 6 — Production Firmware Engineering](#stage-6-production-firmware-engineering)
- [Track A — Embedded Linux](#track-a-embedded-linux)
- [Track B — Automotive & AUTOSAR](#track-b-automotive-autosar)
- [Track C — Edge AI & TinyML](#track-c-edge-ai-tinyml)
- [Track D — DSP & Control](#track-d-dsp-control)
- [Reference Shelf — Subjects That Are Their Own Course](#reference-shelf-subjects-that-are-their-own-course)

---

## Stage 0 — Orientation & Your Emulated Lab

> No board required. Set up a toolchain, an emulator and version control, and get something running before you learn any theory. Moved to the Reference Shelf: Editors, IDEs & PlatformIO; Where to Look Things Up; Starter Projects.

### What Embedded Systems Are

- [ ] [Article: "Embedded Systems Roadmap: Bridging the Gap", Memfault Interrupt](https://interrupt.memfault.com/blog/embedded-systems-roadmap-bridging-the-gap) [beginner]
- [ ] [Link: "Embedded Artistry Beginners Roadmap", Embedded Artistry](https://embeddedartistry.com/beginners/)
- [ ] [Link: "Embedded Systems Skill Tree", GitHub](https://github.com/sjpiper145/MakerSkillTree/tree/main/Embedded%20Systems%20Skill%20Tree)
- [ ] [Link: "Interactive Embedded Systems Skill Tree (with progress tracking & sync)", colonelblacc.github](https://colonelblacc.github.io/Embedded-Systems-SkillTree)
- [ ] [Link: "PCB Design Skill Tree", GitHub](https://github.com/sjpiper145/MakerSkillTree/tree/main/PCB%20Design%20Skill%20Tree) [alt]
- [ ] [Link: "FPGA / ASIC Engineering Roadmap", GitHub](https://github.com/m3y54m/FPGA-ASIC-Roadmap) [extra]

### Emulators & Simulators (your hardware)

- [ ] [Link: "Wokwi - Online ESP32, STM32, Arduino Simulator", Wokwi](https://wokwi.com/) [beginner]
- [ ] [Link: "SimulIDE Circuit Simulator", simulide](https://simulide.com/) [beginner] [alt]
- [ ] [Link: "Digital logic designer and circuit simulator designed for educational purposes", GitHub](https://github.com/hneemann/Digital) [beginner] [alt]
- [ ] [Link: "EveryCircuit", everycircuit](https://everycircuit.com/) [beginner] [alt]
- [ ] [Link: "Circuit Simulator Applet", falstad](https://www.falstad.com/circuit/) [beginner] [alt]
- [ ] [Link: "Tinkercad", tinkercad](https://www.tinkercad.com/) [beginner] [alt]
- [ ] [Link: "Voltsim", voltsimulator](https://www.voltsimulator.com/) [beginner] [alt]
- [ ] [Link: "Velxio - Arduino & Embedded Board Emulator", GitHub](https://github.com/davidmonterocrespo24/velxio)
- [ ] [Link: "picoZ80", eaw.app](https://eaw.app/picoz80/)
- [ ] [Link: "Wokwi Documentation", Wokwi](https://docs.wokwi.com/)

### Renode

- [ ] [Link: "Renode - GitHub Repo", GitHub](https://github.com/renode/renode)
- [ ] [Link: "Renode - Documentation", renode.readthedocs](https://renode.readthedocs.io/en/latest/)
- [ ] [Link: "Renode - Official Tutorials", Renode](https://renode.io/tutorials/)
- [ ] [Article: "Cortex-M MCU Emulation with Renode", Memfault Interrupt](https://interrupt.memfault.com/blog/intro-to-renode)
- [ ] [Article: "A simple guide to get started on renode", GitHub](https://github.com/tarciszera/renode_guide) [extra]
- [ ] [Video: "Using CI-based workflow with Renode in bringing TensorFlow Lite to Zephyr", YouTube](https://www.youtube.com/watch?v=jF94cXPoZZg) [extra]

### QEMU

- [ ] [Article: "Building an ARM Embedded Linux System in QEMU", GitHub](https://github.com/dchithinh/mastering-embeded-linux-programming) [beginner]
- [ ] [Link: "QEMU’s documentation", QEMU](https://www.qemu.org/docs/master/index.html)
- [ ] [Article: "Running AVR code in QEMU - A quick-start guide to accelerate AVR firmware development", yeah.nah.nz](https://yeah.nah.nz/embedded/qemu-avr/)
- [ ] [Article: "QEMU Simulation - Blinky - STM32F767ZI Full Stack", longer-vision-robot.gitbook](https://longer-vision-robot.gitbook.io/stm32f767zi-full-stack/chapter-2.-programming-for-stm32/2.4-qemu-simulation-blinky)
- [ ] [Article: "Emulating a Raspberry Pi in QEMU", Memfault Interrupt](https://interrupt.memfault.com/blog/emulating-raspberry-pi-in-qemu) [extra]

### Git

- [ ] [Video: "Git Tutorial for Beginners: Learn Git in 1 Hour", YouTube](https://www.youtube.com/watch?v=8JJ101D3knE) [beginner]
- [ ] [Video: "Git for Professionals Tutorial - Tools & Concepts for Mastering Version Control with Git", YouTube](https://www.youtube.com/watch?v=Uszj_k0DGsg)

### The Shell

- [ ] [Link: "Bash scripting cheatsheet", devhints](https://devhints.io/bash)
- [ ] [Video: "Bash Scripting Tutorial for Beginners", YouTube](https://www.youtube.com/watch?v=tK9Oc6AEnR4) [alt]

### Project Gate — Bring-Up: A Repo Anyone Can Run

> Start the one repository every later stage adds to. A stranger clones it, runs one command, and watches your firmware boot in an emulator - no hardware, no setup.

**What you are building**

The skeleton of **cellguard** - an emulated battery-management node you will grow across every
stage. Today it does one thing: boots on a simulated Cortex-M and prints over UART.

Every later gate adds a layer to *this* repo. By Stage 6 it is a single deep project rather than
eleven abandoned folders.

**Why this is worth showing**

Almost every embedded portfolio says "I blinked an LED on an STM32" and the reviewer cannot check.
Yours runs in twenty seconds on their laptop with no board. That alone puts you in a small
minority, and it is the reason the emulator-first choice pays off.

**Expected output**

```text
$ make run
Renode 1.15  |  platform: stm32f4_discovery
--------------------------------------------
cellguard v0.1.0  (build 2026-09-04 a1b2c3d)
sys: HSI 16 MHz, tick 1 kHz
led: heartbeat on PD12
--------------------------------------------
```

And a repo a stranger can navigate:

```text
cellguard/
  README.md          <- one screenshot, one command, what it is
  Makefile           <- make build | run | test | clean
  src/main.c
  boards/stm32f4.resc <- Renode script
  .github/workflows/ci.yml
```

**What makes it stand out**

The README. One GIF or screenshot of the emulator booting, a single copy-paste command, and two
sentences on what the project becomes. Reviewers spend thirty seconds on a repo - spend your effort
on those thirty seconds.

**Definition of done**

- [ ] Gate: Create the cellguard repo with a README that shows one command to run it
- [ ] Gate: Blink an LED in Wokwi and link the shareable simulation from the README
- [ ] Gate: Boot a Cortex-M binary in Renode from a checked-in .resc platform script
- [ ] Gate: Print a version + build banner over UART so the boot is visibly yours
- [ ] Gate: Add a make target set: build, run, test, clean
- [ ] Gate: Tag it v0.1.0 so the history shows deliberate milestones

---

## Stage 1 — C for Embedded Systems

> The language as it is actually used on a microcontroller: memory you own, hardware you address, and no runtime to save you.

### Learning C

- [ ] [Video: "Microchip University - Syntax And Structure of C - Simply C", Microchip University](https://mu.microchip.com/syntax-and-structure-of-c) [beginner]
- [ ] [Video: "C Programming for Beginners | Full Course", YouTube](https://www.youtube.com/watch?v=ssJY5MDLjlo) [beginner] [alt]
- [ ] [Link: "C by Example", cbyexample](https://www.cbyexample.com/) [beginner] [alt]
- [ ] [Book: "The Little Book of C", little-book-of.github](https://little-book-of.github.io/c/books/en-US/book.html) [beginner] [alt]
- [ ] [Video: "Learn C Programming and OOP with Dr. Chuck", YouTube](https://www.youtube.com/watch?v=PaPN51Mm5qQ) [beginner] [alt]
- [ ] [Video: "C Programming Tutorials (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLA1FTfKBAEX4hblYoH6mnq0zsie2w6Wif) [extra]
- [ ] [Book: "Modern C - Jens Gustedt", gustedt.gitlabpages.inria.fr](https://gustedt.gitlabpages.inria.fr/modern-c/) [extra]
- [ ] [Link: "Embedded C Coding Standard", Barr Group](https://barrgroup.com/embedded-systems/books/embedded-c-coding-standard) [extra]
- [ ] [Link: "newlib C Library Documentation", sourceware](https://sourceware.org/newlib/docs.html) [extra]
- [ ] [Link: "The GNU C Library (glibc)", GNU](https://www.gnu.org/software/libc/documentation.html) [extra]
- [ ] [Article: "Introduction to Nintendo DS Programming", patater](https://www.patater.com/files/projects/manual/manual.html) [extra]
- [ ] [Video: "Microchip University - Advanced C Programming", Microchip University](https://mu.microchip.com/advanced-c-programming) [reference]
- [ ] [Video: "Microchip University - Advanced Embedded C Tips, Tricks, and Cautions", Microchip University](https://mu.microchip.com/advanced-embedded-c-tips-tricks-and-cautions) [reference]
- [ ] [Video: "Microchip University - C Programming: Linked List Data Structures", Microchip University](https://mu.microchip.com/c-programming-linked-list-data-structures) [reference]
- [ ] [Video: "Microchip University - C Programming Callbacks", Microchip University](https://mu.microchip.com/c-programming-callbacks) [reference] [extra]
- [ ] [Book: "The C Programming Language - Brian W. Kernighan, Dennis M. Ritchie", amazon](https://www.amazon.com/dp/0131103628?ref_=cm_sw_r_cp_ud_dp_KRZ8M1WTXWVG0HMSRBXA) [reference] [extra]

### Pointers & Memory Model

- [ ] [Video: "Understanding the C runtime memory model", YouTube](https://www.youtube.com/watch?v=3F3lp_F2YpQ)
- [ ] [Video: "Pointers and dynamic memory - stack vs heap", YouTube](https://www.youtube.com/watch?v=_8-ht2AKyH4)
- [ ] [Video: "Dynamic Memory Allocation | C Programming Tutorial", YouTube](https://www.youtube.com/watch?v=R0qIYWo8igs)
- [ ] [Video: "Dynamic memory allocation in C - malloc calloc realloc free", YouTube](https://www.youtube.com/watch?v=xDVC3wKjS64&t=140s)
- [ ] [Article: "What is Memory Leak in C/C++? How can we avoid?", aticleworld](https://aticleworld.com/what-is-memory-leak-in-c-c-how-can-we-avoid/) [extra]
- [ ] [Article: "Understanding Memory Management in Rust", medium](https://medium.com/geekculture/understanding-memory-management-in-rust-a341cfce9807) [extra]
- [ ] [Article: "Memory Management in Python", realpython](https://realpython.com/python-memory-management/) [extra]
- [ ] [Article: "Memory", Barr Group](https://barrgroup.com/embedded-systems/books/programming-embedded-systems/memory-ram-rom-flash) [extra]
- [ ] [Video: "Different Types of Memory in Microcontroller : Flash Memory, SRAM and EEPROM", YouTube](https://www.youtube.com/watch?v=4WnTTL_7a1g) [extra]
- [ ] [Article: "How to make a heap profiler", Embedded Related](https://www.embeddedrelated.com/showarticle/600.php) [extra]

### The Keywords That Matter

- [ ] [Article: "Keywords to Frequent", Barr Group](https://barrgroup.com/embedded-systems/books/embedded-c-coding-standard/general-rules/keywords-static-volatile-const)
- [ ] [Article: "Efficient C Code for 8-bit Microcontrollers", Barr Group](https://barrgroup.com/embedded-systems/how-to/efficient-c-code)
- [ ] [Article: "Scope regions in C and C++", Embedded](https://www.embedded.com/scope-regions-in-c-and-c/)
- [ ] [Article: "Pragmas", GCC GNU](https://gcc.gnu.org/onlinedocs/cpp/Pragmas.html)
- [ ] [Article: "Using GNU C attribute", unixwiz](http://unixwiz.net/techtips/gnu-c-attributes.html) [extra]
- [ ] [Article: "Inline Functions In C", greenend](https://www.greenend.org.uk/rjk/tech/inline.html) [extra]

### Bit Manipulation

- [ ] [Video: "Switching to C to Program the MSP430 - Bitwise Logic Operations", YouTube](https://www.youtube.com/watch?v=KZs5eT5XDGU&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=71)
- [ ] [Video: "Switching to C to Program the MSP430 - Arithmetic", YouTube](https://www.youtube.com/watch?v=7KMy0lgxZhI&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=70)

### Concepts Worth Internalising

- [ ] [Article: "Part I: Idempotence", Embedded Related](https://www.embeddedrelated.com/showarticle/629.php)
- [ ] [Article: "Part II: Immutability", Embedded Related](https://www.embeddedrelated.com/showarticle/639.php)
- [ ] [Article: "Part III: Volatility", Embedded Related](https://www.embeddedrelated.com/showarticle/649.php)
- [ ] [Article: "Part IV: Singletons", Embedded Related](https://www.embeddedrelated.com/showarticle/691.php)
- [ ] [Article: "Part V: State Machines", Embedded Related](https://www.embeddedrelated.com/showarticle/723.php#comments) [extra]
- [ ] [Article: "Part VI : Abstraction", Embedded Related](https://www.embeddedrelated.com/showarticle/792.php) [extra]

### Data Structures for Constrained Systems

- [ ] [Link: "Collection of various algorithms in mathematics, machine learning, computer science, physics, etc implemented in C for educational purposes", GitHub](https://github.com/TheAlgorithms/C)
- [ ] [Link: "Data Structures in C", sanfoundry](https://www.sanfoundry.com/c-programming-examples-data-structures/)
- [ ] [Video: "Data Structures - Full Course Using C and C++", YouTube](https://www.youtube.com/watch?v=B31LgI4Y4DQ) [alt]
- [ ] [Link: "Hello Algo", hello-algo](https://www.hello-algo.com/en/)
- [ ] [Video: "Circular Buffer | Circular Buffer Implementation in C", YouTube](https://www.youtube.com/watch?v=uvD9_Wdtjtw)

### A Little Assembly

- [ ] [Article: "Introduction to ARM Assembly Basics", azeria-labs](https://azeria-labs.com/writing-arm-assembly-part-1/) [beginner]
- [ ] [Video: "Assembly Language Programming with ARM – Full Tutorial for Beginners", YouTube](https://www.youtube.com/watch?v=gfmRrPjnEw4) [alt]
- [ ] [Article: "How to Use Inline Assembly Language in C Code", gcc.gnu](https://gcc.gnu.org/onlinedocs/gcc/Using-Assembly-Language-with-C.html)
- [ ] [Link: "Battery info program for x86-64 Linux laptops in 298 bytes of machine code", GitHub](https://github.com/meribold/btry)

### Project Gate — libcore: The Foundation, Tested On Your PC

> Write the small allocation-free library the rest of the firmware stands on, and prove it with tests that run on your laptop in milliseconds.

**What you are building**

`libcore` inside cellguard: a **lock-free ring buffer**, **fixed-point maths**, and a **CRC-16**.
Pure C99, zero dynamic allocation, no hardware dependencies - so it compiles and tests on the host.

These three are not busywork: the ring buffer carries your UART and CAN traffic in Stage 4, the
fixed-point type holds cell voltages without an FPU, and the CRC guards your firmware images in
Stage 6.

**Why this is worth showing**

"No `malloc` and here are the tests" is the sentence that separates an embedded engineer from a
programmer who happens to use C. Host-testable driver-free logic is also what makes Stage 6's CI
possible at all.

**Expected output**

```c
/* ringbuf.h - fixed capacity, single producer, single consumer */
typedef struct { uint8_t *buf; uint16_t head, tail, mask; } rb_t;

bool     rb_init(rb_t *rb, uint8_t *storage, uint16_t size_pow2);
bool     rb_put(rb_t *rb, uint8_t byte);      /* false when full  */
bool     rb_get(rb_t *rb, uint8_t *out);      /* false when empty */
uint16_t rb_used(const rb_t *rb);
```

```text
$ make test
libcore: 41 tests, 41 passed, 0 failed   (18 ms)
  ringbuf ......... 14 passed   (wrap, full, empty, ISR interleave)
  fixed ........... 19 passed   (saturation, rounding, div-by-zero)
  crc16 ...........  8 passed   (known vectors, incremental)
lines covered: 96.4%
```

**What makes it stand out**

Put the **saturation and wrap-around edge cases** in the test names and show the coverage number in
the README. Then add one paragraph: *why* single-producer/single-consumer needs no lock on a
Cortex-M, and exactly which assumption breaks if a second producer appears. Judgement shown beats
code shown.

**Definition of done**

- [ ] Gate: Write a fixed-capacity ring buffer with no dynamic allocation
- [ ] Gate: Make it correct for one ISR producer and one main-loop consumer without a lock
- [ ] Gate: Write a Q15 or Q16.16 fixed-point type with saturating add, multiply and divide
- [ ] Gate: Add a CRC-16 you will reuse for firmware image validation in Stage 6
- [ ] Gate: Cover wrap-around, full, empty and saturation explicitly in host tests
- [ ] Gate: Report a coverage percentage in the README
- [ ] Gate: Document why the lock-free claim holds, and the assumption that would break it
- [ ] Gate: Compile clean at -Wall -Wextra -Werror -std=c99

---

## Stage 2 — Toolchain, Build System & Debugging

> What you actually spend your day doing. Most self-taught engineers skip this and stay stuck at "it works on my machine".

### Cross Compilation & GCC

- [ ] [Article: "GCC and Make - Compiling, Linking and Building C/C++ Applications", www3.ntu](https://www3.ntu.edu.sg/home/ehchua/programming/cpp/gcc_make.html)
- [ ] [Article: "The Best and Worst GCC Compiler Flags For Embedded", Memfault Interrupt](https://interrupt.memfault.com/blog/best-and-worst-gcc-clang-compiler-flags)
- [ ] [Article: "Bare Metal - From zero to blink", linuxembedded.fr](https://www.linuxembedded.fr/2021/02/bare-metal-from-zero-to-blink)
- [ ] [Article: "Compiling, Linking, and Locating", Barr Group](https://barrgroup.com/embedded-systems/books/programming-embedded-systems/compiling-linking-locating)

### From Zero to main() — how firmware actually starts

- [ ] [Article: "From Zero to main(): Bootstrapping libc with Newlib", Memfault Interrupt](https://interrupt.memfault.com/blog/boostrapping-libc-with-newlib)
- [ ] [Article: "From Zero to main(): Bare metal C", Memfault Interrupt](https://interrupt.memfault.com/blog/zero-to-main-1) [reference]
- [ ] [Article: "From Zero to main(): Demystifying Firmware Linker Scripts", Memfault Interrupt](https://interrupt.memfault.com/blog/how-to-write-linker-scripts-for-firmware) [reference]

### Make & CMake

- [ ] [Article: "The most thoroughly commented embedded CMakeLists file", dnedic.github](https://dnedic.github.io/blog/the-most-thoroughly-commented-embedded-cmakelists/) [beginner]
- [ ] [Article: "A Shallow Dive into GNU Make", Memfault Interrupt](https://interrupt.memfault.com/blog/gnu-make-guidelines)
- [ ] [Video: "Building STM32 projects from scratch with cross platform tools like Make, CMake and arm-gcc compiler toolchain (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLEg2mgYz66IOcHRvvUDf9O1ZCGy58M1Bt)
- [ ] [Link: "CMake Tutorial", CMake](https://cmake.org/cmake/help/latest/guide/tutorial/index.html)
- [ ] [Video: "How to CMake Good (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLK6MXr8gasrGmIiSuVQXpfFuE1uPT615s) [alt]
- [ ] [Link: "A lightweight build and workflow tool for C/C++", GitHub](https://github.com/randerson112/craft) [extra]

### Reproducible Builds with Docker

- [ ] [Article: "Docker for Dummies", dev.to](https://dev.to/stevenmcgown/docker-for-dummies-2bff) [beginner]
- [ ] [Link: "Docker Docs", docker](https://docs.docker.com/get-started/)
- [ ] [Video: "Introduction to Docker for the Embedded Developer", YouTube](https://www.youtube.com/watch?v=Fz7ou-VBk-w)
- [ ] [Video: "Intro to CI/CD Part 1: Getting Started with Docker | Digi-Key Electronics", YouTube](https://youtu.be/1nxGcfIm-TU)
- [ ] [Article: "A Modern C Development Environment", Memfault Interrupt](https://interrupt.memfault.com/blog/a-modern-c-dev-env) [extra]

### GDB

- [ ] [Article: "Advanced GDB Usage", Memfault Interrupt](https://interrupt.memfault.com/blog/advanced-gdb)
- [ ] [Article: "How do breakpoints even work?", Memfault Interrupt](https://interrupt.memfault.com/blog/cortex-m-breakpoints)
- [ ] [Link: "GNU GDB Debugger Command Cheat Sheet", yolinux](http://www.yolinux.com/TUTORIALS/GDB-Commands.html)
- [ ] [Link: "gdbgui - A browser-based frontend to gdb (gnu debugger)", gdbgui](https://www.gdbgui.com/)
- [ ] [Video: "everyone needs to stop using print debugging (do THIS instead)", YouTube](https://www.youtube.com/watch?v=3T3ZDquDDVg) [extra]
- [ ] [Video: "GDB is REALLY easy! Find Bugs in Your Code with Only A Few Commands", YouTube](https://www.youtube.com/watch?v=Dq8l1_-QgAc) [extra]
- [ ] [Article: "Introduction to ARM Semihosting", Memfault Interrupt](https://interrupt.memfault.com/blog/arm-semihosting) [extra]

### JTAG & SWD

- [ ] [Article: "A Deep Dive into ARM Cortex-M Debug Interfaces", Memfault Interrupt](https://interrupt.memfault.com/blog/a-deep-dive-into-arm-cortex-m-debug-interfaces)
- [ ] [Link: "Guide: Connecting your debugger", stm32-base](https://stm32-base.org/guides/connecting-your-debugger.html)
- [ ] [Video: "STM32 + SWD + ST-Link + CubeIDE | Debugging on Custom Hardware Tutorial - Phil's Lab #4", YouTube](https://www.youtube.com/watch?v=qMUzLU636s8)
- [ ] [Article: "Diving into JTAG protocol. Part 1 — Overview", medium](https://medium.com/@aliaksandr.kavalchuk/diving-into-jtag-protocol-part-1-overview-fbdc428d3a16)
- [ ] [Article: "Diving into JTAG protocol. Part 2 — Debugging", medium](https://medium.com/@aliaksandr.kavalchuk/diving-into-jtag-protocol-part-2-debugging-56a566db3cf8) [extra]
- [ ] [Article: "Diving into JTAG protocol. Part 3 — Boundary Scan", medium](https://medium.com/@aliaksandr.kavalchuk/diving-into-jtag-part-3-boundary-scan-17f9975ecc59) [extra]
- [ ] [Article: "Using Asserts in Embedded Systems", Memfault Interrupt](https://interrupt.memfault.com/blog/asserts-in-embedded-systems) [extra]

### OpenOCD

- [ ] [Link: "OpenOCD - GitHub repository", GitHub](https://github.com/openocd-org/openocd)
- [ ] [Video: "This Is 100% How You Should Be Debugging | How to Use OpenOCD to Debug Embedded Software with GDB", YouTube](https://www.youtube.com/watch?v=_1u7IOnivnM)

### Reading the Bus — scopes & analyzers

- [ ] [Video: "What’s an OSCILLOSCOPE?", YouTube](https://youtu.be/DgYGRtkd9Vs) [beginner]
- [ ] [Video: "How to Use an Oscilloscope", YouTube](https://youtu.be/u4zyptPLlJI) [beginner] [alt]
- [ ] [Video: "How to use an oscilloscope / What is an oscilloscope / Oscilloscope tutorial", YouTube](https://youtu.be/CzY2abWCVTY) [beginner] [alt]
- [ ] [Video: "Instrument Basics: Logic Analyzer", YouTube](https://youtu.be/u1DYs2I-_lU)
- [ ] [Video: "Understanding EMI Debugging with Oscilloscopes", YouTube](https://www.youtube.com/watch?v=x1rn5YNLmVw)
- [ ] [Video: "EEVblog #44 Part 1 - Logic Analyzer Tutorial", YouTube](https://www.youtube.com/watch?v=TWKY6W1C9yM)
- [ ] [Video: "EEVblog #44 - Part 2 - Logic Analyzer Tutorial", YouTube](https://www.youtube.com/watch?v=nAlNP-Z4QAQ) [extra]
- [ ] [Video: "How to Debug Embedded Designs with an Oscilloscope", YouTube](https://www.youtube.com/watch?v=10bZ0edG6Ts) [extra]
- [ ] [Video: "How to test Automotive Serial Buses with Oscilloscopes", YouTube](https://www.youtube.com/watch?v=TJK3m91ki7o) [extra]

### Project Gate — Reproducible Build, Readable Memory Map

> Take full control of how the binary is produced and where every byte lands - then make it build identically on any machine.

**What you are building**

The build system for cellguard: cross-compilation, **your own linker script**, a Docker image that
reproduces the build anywhere, and a memory report printed on every build.

**Why this is worth showing**

Ask a mid-level candidate what their linker script does and most cannot answer. A repo with a
commented linker script and a `make size` table showing exactly where flash and RAM went is
immediate evidence of the level you are at. The Docker image also means the reviewer's build
matches yours - no "works on my machine".

**Expected output**

```text
$ make size
   text     data      bss      dec    flash%   ram%
  18 432      112    4 096   22 640    3.5%    1.2%

  .isr_vector   0x08000000    428 B
  .text         0x080001ac  18 004 B
  .rodata       0x08004800   1 240 B
  .data         0x20000000    112 B   (load 0x08004cd8)
  .bss          0x20000070  4 096 B
  stack top     0x20020000
```

```text
$ docker run --rm -v $PWD:/w cellguard-build make -C /w build
# byte-identical binary to the local build:
$ sha256sum build/cellguard.elf
9f2c...e41  build/cellguard.elf
```

**What makes it stand out**

A `docs/memory.md` that walks the boot path in your own words: reset vector, `.data` copied from
flash to RAM, `.bss` zeroed, stack pointer set, `main()` entered. Link each step to the line in
*your* startup file. That document is worth more in an interview than the code.

**Definition of done**

- [ ] Gate: Cross-compile to ARM from a Makefile or CMakeLists you wrote yourself
- [ ] Gate: Write and comment your own linker script - do not copy a vendor one blindly
- [ ] Gate: Add a make size target that reports text/data/bss and flash/RAM percentage
- [ ] Gate: Reproduce the exact same binary inside a Docker image and check the hash
- [ ] Gate: Write docs/memory.md tracing reset vector to main() through your startup code
- [ ] Gate: Attach GDB to QEMU or Renode, break inside an ISR and inspect the stack
- [ ] Gate: Record the exact debug commands in the README so a reviewer can repeat them

---

## Stage 3 — Bare-Metal Microcontroller Programming

> Datasheet to working driver, with no HAL in between. This is the core skill. Moved to the Reference Shelf: Register-Level Drills (MSP430 walkthroughs).

### Microcontroller Fundamentals

- [ ] [Video: "NewbieHack - Microcontroller Tutorial - A Beginners Guide (AVR)", YouTube](https://www.youtube.com/playlist?list=PLE72E4CFE73BD1DE1) [beginner]
- [ ] [Video: "Getting Started with STM32 and Nucleo (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLEBQazB0HUyRYuzfi4clXsKUSgorErmBv) [beginner] [alt]
- [ ] [Video: "Intro to Raspberry Pi Pico and RP2040 (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLEBQazB0HUyQO6rJxKr2umPCgmfAU-cqR) [beginner] [alt]
- [ ] [Article: "What Is a Microcontroller? The Defining Characteristics and Architecture of a Common Component", All About Circuits](https://www.allaboutcircuits.com/technical-articles/what-is-a-microcontroller-introduction-component-characteristics-component/)
- [ ] [Article: "How to Choose the Right Microcontroller for Your Application", All About Circuits](https://www.allaboutcircuits.com/technical-articles/how-to-choose-the-right-microcontroller-for-your-application/)
- [ ] [Article: "How to Read a Microcontroller Datasheet: Introduction and First Steps", All About Circuits](https://www.allaboutcircuits.com/technical-articles/how-to-read-a-microcontroller-datasheet-introduction-and-first-steps2/)
- [ ] [Link: "Getting started with STM32: STM32 step-by-step", st](https://wiki.st.com/stm32mcu/wiki/Category:Getting_started_with_STM32_:_STM32_step_by_step) [extra]
- [ ] [Video: "Getting Started With AVR (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLtQdQmNK_0DRhBWYZ32BEILOykXLpJ8tP) [alt]
- [ ] [Video: "Fundamentals of Microcontrollers - Arduino bare-metal breakdown (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLNyfXcjhOAwOF-7S-ZoW2wuQ6Y-4hfjMR) [alt]
- [ ] [Video: "Bare Metal Embedded Programming: Theory and Practice Using STM32 (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PL4cGeWgaBTe155QQSQ72DksLIjBn5Jn2Z) [alt]
- [ ] [Link: "Awesome Embedded: A curated list of awesome embedded programming", GitHub](https://github.com/nhivp/Awesome-Embedded) [extra]
- [ ] [Link: "Awesome Electronics: A curated list of electronics resources", GitHub](https://github.com/kitspace/awesome-electronics) [extra]
- [ ] [Video: "ARM University, ARM Architecture Fundamentals", YouTube](https://www.youtube.com/watch?v=7LqPJGnBPMM) [extra]
- [ ] [Video: "Get to Know the ARM Cortex M7", YouTube](https://www.youtube.com/watch?v=GaV1j_5UVys) [extra]
- [ ] [Article: "Big Endian, Little Endian, Endianness: Understanding Byte Arrangements in Digital Systems", All About Circuits](https://www.allaboutcircuits.com/technical-articles/big-endian-little-endian-endianness-byte-arrangement-digital-systems/) [extra]
- [ ] [PDF: "Introduction to Microcontrollers", Gunther Gridling, Bettina Weiss](https://ti.tuwien.ac.at/ecs/teaching/courses/mclu/theory-material/Microcontroller.pdf) [extra]
- [ ] [Video: "Arm Education Media Launches System-on-Chip Design Online Courses", YouTube](https://www.youtube.com/watch?v=n9cUiEdqdJU) [extra]
- [ ] [Article: "Single-board computer", Wikipedia](https://en.wikipedia.org/wiki/Single-board_computer) [extra]
- [ ] [Article: "How FPGAs work, and why you'll buy one", Embedded Related](https://www.embeddedrelated.com/showarticle/195.php) [extra]

### Registers, Memory Maps & Peripherals

- [ ] [Article: "Peripherals", Barr Group](https://barrgroup.com/embedded-systems/books/programming-embedded-systems/peripherals-device-drivers)
- [ ] [Video: "Level Up Your Arduino Code: Registers", YouTube](https://www.youtube.com/watch?v=6q1yEb_ukw8)
- [ ] [Video: "Bit Fields in C. What are they, and how do I use them?", YouTube](https://www.youtube.com/watch?v=aMAM5vL7wTs)
- [ ] [Video: "Exploring Configurable Logic Peripherals on PIC® and AVR® Microcontrollers", YouTube](https://www.youtube.com/watch?v=beZXfAUR-PE)

### GPIO

- [ ] [Video: "Tutorial 5: Peripheral 1 - General purpose Input Output (GPIO) Configuration in STM32", YouTube](https://youtu.be/tjDhmavBGf0)
- [ ] [Video: "How GPIO works | General Purpose Input Output | GPIO Behind The Scene", YouTube](https://www.youtube.com/watch?v=QxvdmzKxEeg) [alt]
- [ ] [Article: "Introduction to Microcontrollers - Hello World", Embedded Related](https://www.embeddedrelated.com/showarticle/460.php)
- [ ] [Article: "Introduction to Microcontrollers - More On GPIO", Embedded Related](https://www.embeddedrelated.com/showarticle/462.php)
- [ ] [Video: "Using GPIO with the MSP430 Microcontroller", YouTube](https://www.youtube.com/watch?v=WsbA_iPXIvw)
- [ ] [Article: "Using Pull-Up and Pull-Down Resistors", Stratify Labs](https://blog.stratifylabs.co/device/2013-10-25-Using-Pull-Up-and-Pull-Down-Resistors/) [extra]
- [ ] [Video: "GPIO Output Configuration | Open Drain configuration | Push Pull configuration", YouTube](https://www.youtube.com/watch?v=IjKDKGqCm_4) [extra]
- [ ] [Video: "GPIO Output Mode: Working of Open Drain Configuration", YouTube](https://www.youtube.com/watch?v=YQ5fkusMIMA) [extra]

### Interrupts

- [ ] [Video: "Polling/Interrupt/DMA differences explained easily", YouTube](https://www.youtube.com/watch?v=LNPBr3WvuNg)
- [ ] [Video: "Level Up Your Arduino Code: External Interrupts", YouTube](https://www.youtube.com/watch?v=J61_PKyWjxU)
- [ ] [Video: "Tutorial 10: Peripheral 2 - Nested Vector Interrupt controller (NVIC) in STM32", YouTube](https://www.youtube.com/watch?v=qwebM-YaSU4)
- [ ] [Video: "Tutorial 11: LAB - External Interrupt ( EXTI ) Interfacing in STM32 using STM32CUBEMX", YouTube](https://www.youtube.com/watch?v=oJc0seuBbzI)
- [ ] [Video: "Tutorial 12: Interrupt Priorities in STM32", YouTube](https://www.youtube.com/watch?v=aXLJD4qJmtk) [extra]
- [ ] [Article: "Introduction to Microcontrollers - Interrupts", Embedded Related](https://www.embeddedrelated.com/showarticle/469.php) [extra]

### Timers & Counters

- [ ] [Article: "Introduction to Microcontroller Timers: Periodic Timers", All About Circuits](https://www.allaboutcircuits.com/technical-articles/introduction-to-microcontroller-timers-periodic-timers/)
- [ ] [Article: "AVR Timer programming", exploreembedded](https://exploreembedded.com/wiki/AVR_Timer_programming)
- [ ] [Video: "STM32 TIMERS (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLfIJKC1ud8gjLZBzjE3kKBMDEH_lUc428)
- [ ] [Article: "Real Time Clocks (RTCs) in Microcontroller Timers", All About Circuits](https://www.allaboutcircuits.com/technical-articles/introduction-to-microcontroller-timers-real-time-clocks/)
- [ ] [Article: "Introduction to Microcontrollers - More Timers and Displays", Embedded Related](https://www.embeddedrelated.com/showarticle/485.php) [extra]

### PWM

- [ ] [Video: "What is PWM?", YouTube](https://www.youtube.com/watch?v=B_Ysdv1xRbA)
- [ ] [Article: "Pulse-width Modulation (PWM) Timers in Microcontrollers", All About Circuits](https://www.allaboutcircuits.com/technical-articles/introduction-to-microcontroller-timers-pwm-timers/)
- [ ] [Video: "STM32 Guide #3: PWM + Timers", YouTube](https://www.youtube.com/watch?v=AjN58ceQaF4)
- [ ] [Video: "MSP430 - Creating PWM Signals using Timer Compares", YouTube](https://www.youtube.com/watch?v=JvoYbDhFBUY&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=80)

### ADC & DAC

- [ ] [Video: "How Do ADCs Work? - The Learning Circuit", YouTube](https://www.youtube.com/watch?v=g4BvbAKNQ90)
- [ ] [Video: "Tutorial 13: ADC in STM32F4", YouTube](https://youtu.be/vIlG_i3GqeU)
- [ ] [Video: "Tutorial 14: ADC by Polling", YouTube](https://www.youtube.com/watch?v=uUi6JyUuEJA)
- [ ] [Video: "How Do DACs Work? - The Learning Circuit", YouTube](https://www.youtube.com/watch?v=YAxrmoVtEtE) [alt]
- [ ] [Video: "DAC in STM32 || Sine wave || HAL || CubeIDE", YouTube](https://www.youtube.com/watch?v=6Z1L6ox63j0)
- [ ] [Article: "About Digital to Analog Converter (DAC) and Its Applications", ElProCus](https://www.elprocus.com/digital-to-analog-converter-dac-applications/) [extra]

### DMA

- [ ] [Video: "Introduction to Direct Memory Access (DMA)", YouTube](https://www.youtube.com/watch?v=M16l_ymlfcs)
- [ ] [Video: "STM32 DMA PT 1", YouTube](https://www.youtube.com/watch?v=yvLHtXJ_KSg)
- [ ] [Video: "STM32 DMA PT 2", YouTube](https://www.youtube.com/watch?v=Kb8dX18xYuo) [alt]
- [ ] [Video: "Getting Started With STM32 & Nucleo Part 4: Working with ADC and DMA - Maker.io", YouTube](https://www.youtube.com/watch?v=EsZLgqhqfO0)
- [ ] [Video: "STM32 UART DMA and IDLE LINE || Receive unknown length DATA", YouTube](https://www.youtube.com/watch?v=Bo6MC5A8uTE)

### Clock Management

- [ ] [Article: "Clock Configuration in STM32", medium](https://medium.com/@csrohit/clock-configuration-in-stm32-6a058da220e0)
- [ ] [Video: "STM32: Change clock speed via registers", YouTube](https://www.youtube.com/watch?v=W_9jPMgiqaQ)
- [ ] [Video: "#1. Intro to STM32F4 Register Based Programming || Clock Setup || LED Blinking || NO HAL", YouTube](https://www.youtube.com/watch?v=GJ_LFAlOlSk)
- [ ] [Video: "Tutorial 8: MCU Clocks configuration in STM32 using STM32CUBEMX", YouTube](https://www.youtube.com/watch?v=y8yNsWpQiTM)
- [ ] [Video: "Clock sources and PLL in ARM Cortex M4", YouTube](https://www.youtube.com/watch?v=2ou8FQ_7PdI) [extra]

### Watchdog

- [ ] [Article: "A Guide to Watchdog Timers for Embedded Systems", Memfault Interrupt](https://interrupt.memfault.com/blog/firmware-watchdog-best-practices)
- [ ] [Article: "Watchdog Timers in Microcontrollers", All About Circuits](https://www.allaboutcircuits.com/technical-articles/watchdog-timers-microcontroller-timers/) [alt]
- [ ] [Video: "The Watchdog Timer on Arduino", YouTube](https://www.youtube.com/watch?v=AzZBgH67mgE)
- [ ] [Video: "WATCHDOGS in STM32 || IWDG and WWDG || CubeIDE", YouTube](https://www.youtube.com/watch?v=AelNsnpfbcM)
- [ ] [Article: "Introduction to Watchdog Timers", Embedded](https://www.embedded.com/introduction-to-watchdog-timers/) [alt]

### Low Power Design

- [ ] [Video: "SLEEP Mode in STM32F103 || CubeIDE || Low Power Mode || Current Consumption", YouTube](https://www.youtube.com/watch?v=2rKcsGkCG0s)
- [ ] [Video: "STOP MODE in STM32 || CubeIDE || Low Power Mode", YouTube](https://www.youtube.com/watch?v=UtQhc4XV8k4)
- [ ] [Video: "How To Lower AVR Microcontroller Power using Power Reduction Registers", YouTube](https://www.youtube.com/watch?v=S82BSPbYoVA)
- [ ] [Video: "Atmel: picoPower Labs - Basic Power-Saving Techniques", YouTube](https://www.youtube.com/watch?v=bdWV-tOTVSE)
- [ ] [Video: "Microcontroller Design Considerations for Ultra Low Power Applications", YouTube](https://www.youtube.com/watch?v=pX0gamab5IM) [extra]
- [ ] [Video: "Ultra Low Power Microcontroller Design", YouTube](https://www.youtube.com/watch?v=yyoR0o5YBVI) [extra]

### Memory Technologies

- [ ] [Article: "NAND and eMMC: All You Need to Know About Flash Memory", makeuseof](https://www.makeuseof.com/tag/nand-emmc-need-know-flash-memory/)
- [ ] [Video: "QSPI in STM32 || Write and Read || N25Q", YouTube](https://www.youtube.com/watch?v=xIfh_uYy-OU)
- [ ] [Video: "QSPI in STM32 || Boot from EXT Memory || XIP || N25Q", YouTube](https://www.youtube.com/watch?v=gAyuF20ok8c)
- [ ] [Video: "Flash Memory in Embedded Linux Systems", YouTube](https://www.youtube.com/watch?v=hdwMvwJIV-Y)
- [ ] [Video: "Using EEPROM with Arduino - Internal & External", YouTube](https://www.youtube.com/watch?v=ShqvATqXA7g) [extra]
- [ ] [Article: "SRAM vs DRAM: Difference Between SRAM & DRAM Explained", enterprisestorageforum](https://www.enterprisestorageforum.com/hardware/sram-vs-dram/) [extra]
- [ ] [Video: "What is SRAM?", YouTube](https://www.youtube.com/watch?v=kU2SsUUsftA) [extra]
- [ ] [Video: "SDRAM Hardware & Firmware Tutorial (STM32) - Phil's Lab #80", YouTube](https://www.youtube.com/watch?v=h28D4AaPSjg) [extra]
- [ ] [Video: "SDRAM in STM32 || MT48LC4", YouTube](https://www.youtube.com/watch?v=QnDenqvzwyE) [extra]

### HAL, BSP & Driver Architecture

- [ ] [Video: "0x1b7 What is a BSP | Board Support Package | Big Picture | Embedded Systems Software Development", YouTube](https://www.youtube.com/watch?v=Bn_6kxRTTSM)

### Project Gate — Bare-Metal Drivers, Written From The Manual

> Write the peripheral drivers from the reference manual alone - no vendor HAL, no copied example - and show the register evidence for every line.

**What you are building**

cellguard's hardware layer: **GPIO**, a **periodic timer interrupt**, an **ADC read**, and a
**DMA transfer**, all driven by writes to registers you looked up yourself in the reference manual.

The ADC becomes your cell-voltage sampler; the timer becomes the control tick; DMA is what keeps
the CPU free while sampling.

**Why this is worth showing**

"Configure this peripheral from the datasheet" is *the* embedded interview exercise. A repo where
each driver links to the manual section and register it came from proves you can do it before
anyone asks.

**Expected output**

```c
/* adc.c - STM32F4 RM0090 s13.13.2, ADC_CR2 */
void adc_init(void) {
    RCC->APB2ENR |= RCC_APB2ENR_ADC1EN;      /* RM0090 s6.3.11 */
    ADC1->SMPR2   = ADC_SMPR2_SMP0_2;        /* 84 cycles - Rsource < 10k */
    ADC1->CR2     = ADC_CR2_ADON;            /* RM0090 s13.13.3 */
}
```

And a `docs/registers.md` table a reviewer can audit:

| Peripheral | Register | Field | Value | Manual |
|---|---|---|---|---|
| ADC1 | SMPR2 | SMP0 | 0b100 | RM0090 §13.13.5 |
| TIM2 | PSC | - | 15999 | RM0090 §18.4.11 |

```text
$ make run
tick: 1000 Hz  (measured 999.98 Hz over 60 s)
adc: dma ring 64 samples, cpu idle 98.7% during conversion
```

**What makes it stand out**

The measurement. Anyone can claim a 1 kHz tick; showing it measured at 999.98 Hz over a minute, and
the CPU idle percentage during DMA, is the difference between "I wrote a driver" and "I verified a
driver".

**Definition of done**

- [ ] Gate: Write a GPIO driver from the reference manual with no vendor HAL
- [ ] Gate: Add a timer that raises a periodic interrupt at a rate you choose
- [ ] Gate: Handle that interrupt and prove the rate by measuring it over 60 seconds
- [ ] Gate: Read the ADC and stream conversions into a ring buffer using DMA
- [ ] Gate: Show CPU idle time during DMA to prove the transfer is not CPU-driven
- [ ] Gate: Keep docs/registers.md linking every field you set to its manual section
- [ ] Gate: Make the whole hardware layer swappable behind a header so Stage 6 can mock it

---

## Stage 4 — Buses, Protocols & Connectivity

> Every embedded product talks to something. UART, SPI and I²C first, then CAN — the backbone of automotive and battery systems. Moved to the Reference Shelf: Long-Range & Mesh (LoRa, Zigbee, Thread, Matter).

### Serial Communication Overview

- [ ] [Video: "Understanding Serial Protocols", YouTube](https://www.youtube.com/watch?v=LEz5UCN3aHA) [beginner]
- [ ] [Video: "Serial Protocol Fundamentals", YouTube](https://www.youtube.com/watch?v=yz7h5xd18OE) [beginner] [alt]
- [ ] [Article: "Understanding and Selecting in 2024: I2C, SPI, UART Explained", parlezvoustech](https://www.parlezvoustech.com/en/comparaison-protocoles-communication-i2c-spi-uart/) [beginner] [alt]
- [ ] [Article: "Basics of Wired Embedded Protocols", piolabs](https://piolabs.com/blog/engineering/wired-embedded-protocols-basics.html) [beginner] [alt]
- [ ] [Video: "PROTOCOLS: UART - I2C - SPI - Serial communications #001", YouTube](https://www.youtube.com/watch?v=IyGwvGzrqp8)

### UART

- [ ] [Video: "Understanding UART", YouTube](https://www.youtube.com/watch?v=sTHckUyxwp8) [beginner]
- [ ] [Video: "how does UART work??? (explained clearly)", YouTube](https://www.youtube.com/watch?v=V6m2skVlsQI)
- [ ] [Video: "Basics of UART Communication | UART Frame Structure | RS 232 Basics | Part1", YouTube](https://www.youtube.com/watch?v=JuvWbRhhpdI)
- [ ] [Video: "Understanding UART Communication Programming | UART Peripherals | Part 2", YouTube](https://www.youtube.com/watch?v=QmjKRwgddxw)
- [ ] [Video: "The RS-232 protocol", YouTube](https://www.youtube.com/watch?v=AHYNxpqKqwo) [extra]
- [ ] [Video: "The UART - Serial Com Overview", YouTube](https://www.youtube.com/watch?v=p_YOsh7BSDE&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=82) [extra]
- [ ] [Video: "UART - The UART Standard", YouTube](https://www.youtube.com/watch?v=4ieYL74YcBY&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=83) [extra]
- [ ] [Video: "UART - Configuring the UART Tx", YouTube](https://www.youtube.com/watch?v=edfQ5KvGD5I&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=84) [extra]
- [ ] [Video: "UART - Configuring the Baud Rate", YouTube](https://www.youtube.com/watch?v=07uSLwIzGSY&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=85) [extra]
- [ ] [Video: "UART - Transmitting a Byte at 115200 Baud", YouTube](https://www.youtube.com/watch?v=bc6hjHCi8JI&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=87) [extra]
- [ ] [Video: "UART - Transmitting a Byte at 9600 Baud", YouTube](https://www.youtube.com/watch?v=VWstSzoyMS8&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=88) [extra]
- [ ] [Video: "UART - Transmitting a Character to the Terminal", YouTube](https://www.youtube.com/watch?v=XmJZ3pZzrHY&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=89) [extra]
- [ ] [Video: "UART - Transmitting a String to the Terminal", YouTube](https://www.youtube.com/watch?v=ESC315fIGnM&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=90) [extra]
- [ ] [Video: "UART - Transmitting String to the Terminal w/ IRQs", YouTube](https://www.youtube.com/watch?v=VBRUyLcqXV4&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=91) [extra]
- [ ] [Video: "UART - Configuring the UART Rx", YouTube](https://www.youtube.com/watch?v=4mvz00QjAfs&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=92) [extra]
- [ ] [Video: "UART - Receiving Characters from the Terminal", YouTube](https://www.youtube.com/watch?v=k4AHC-U45kw&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=93) [extra]
- [ ] [Video: "What is RS232 and What is it Used for?", YouTube](https://www.youtube.com/watch?v=eo9dbnrpspM) [extra]
- [ ] [Video: "RS-232, RS-422, RS-485: What Are the Differences?", YouTube](https://www.youtube.com/watch?v=9O_NgoU1CUc) [extra]

### SPI

- [ ] [Video: "Understanding SPI", YouTube](https://www.youtube.com/watch?v=0nVNwozXsIc) [beginner]
- [ ] [Video: "SPI: The serial peripheral interface", YouTube](https://www.youtube.com/watch?v=MCi7dCBhVpQ)
- [ ] [Video: "Getting Started with STM32 and Nucleo Part 5: How to Use SPI | Digi-Key Electronics", YouTube](https://www.youtube.com/watch?v=eFKeNPJq50g)
- [ ] [Video: "SPI - SPI Overview & Implementation on the MSP430", YouTube](https://www.youtube.com/watch?v=2J8_dpnaBOk&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=94)
- [ ] [Video: "SPI - Sending a Byte as a SPI Master", YouTube](https://www.youtube.com/watch?v=ODmeQ_3gOj4&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=95) [extra]
- [ ] [Video: "SPI - Sending a Packet as a SPI Master using UCTXIFG", YouTube](https://www.youtube.com/watch?v=GRfcO9yX_kg&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=96) [extra]
- [ ] [Video: "SPI - Sending a Packet as a SPI Master using STE/SS", YouTube](https://www.youtube.com/watch?v=2p2rqeeTCXI&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=97) [extra]
- [ ] [Video: "SPI - Receiving a Byte as a SPI Master", YouTube](https://www.youtube.com/watch?v=A-9yCnwcw7k&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=98) [extra]
- [ ] [Video: "SPI - Slave Behavior", YouTube](https://www.youtube.com/watch?v=xAs13cgyJ0Y&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=99) [extra]

### I2C

- [ ] [Video: "Understanding I2C", YouTube](https://www.youtube.com/watch?v=CAvawEcxoPU) [beginner]
- [ ] [Article: "I2C in a Nutshell", Memfault Interrupt](https://interrupt.memfault.com/blog/i2c-in-a-nutshell)
- [ ] [Video: "STM32 I2C SLAVE (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLfIJKC1ud8gj_P7Qb28aTr0t92uk_vwg0)
- [ ] [Video: "What is I3C®?", YouTube](https://www.youtube.com/watch?v=g3TBNHec5Ec)
- [ ] [Link: "MIPI I3C & MIPI I3C Basic", mipi](https://www.mipi.org/specifications/i3c-sensor-specification) [extra]
- [ ] [Article: "I3C Protocol: Understanding and Debug", prodigytechno](https://prodigytechno.com/mipi-i3c-protocol-debug/) [extra]
- [ ] [Video: "MIPI I3C Basic - The next generation sensor interface enabling low-power IoT applications", YouTube](https://www.youtube.com/watch?v=xWKxZp_9RFQ) [extra]
- [ ] [Video: "1-Wire® Technology Overview", YouTube](https://www.youtube.com/watch?v=CjH-OztKe00) [extra]
- [ ] [Video: "I2C - What is I-Squared C and why the Resistors?", YouTube](https://www.youtube.com/watch?v=kWz6ekvoNbw&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=100) [extra]
- [ ] [Video: "I2C - Basic Packet Structure", YouTube](https://www.youtube.com/watch?v=sNYgiHZT_Fo&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=101) [extra]
- [ ] [Video: "I2C - Addressing Slave Registers", YouTube](https://www.youtube.com/watch?v=FCCoERFwcV4&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=102) [extra]
- [ ] [Video: "I2C - Master Configuration on the MSP430FR2355", YouTube](https://www.youtube.com/watch?v=Bwqd9b7ifwQ&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=103) [extra]
- [ ] [Video: "I2C - Adafruit PFC8523 Real-Time-Clock I2C Slave", YouTube](https://www.youtube.com/watch?v=EZl252z3Ee4&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=104) [extra]
- [ ] [Video: "I2C - RTC-LaunchPad Connection & Making a Simple Probe", YouTube](https://www.youtube.com/watch?v=uAOpQYUCO_Y&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=105) [extra]
- [ ] [Video: "I2C - Writing One Byte to an I2C Slave", YouTube](https://www.youtube.com/watch?v=BvITEarUMkc&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=106) [extra]
- [ ] [Video: "I2C - Writing a Register Addr + 3 Bytes to I2C Slave", YouTube](https://www.youtube.com/watch?v=rCa9DVL9Dug&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=107) [extra]
- [ ] [Video: "I2C - Reading One Byte from an I2C Slave", YouTube](https://www.youtube.com/watch?v=f0DMIgp0LCE&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=108) [extra]
- [ ] [Video: "I2C - Reading From a Specific Register Address", YouTube](https://www.youtube.com/watch?v=F1ag5vycS7s&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=109) [extra]
- [ ] [Video: "I2C - Slave Operation", YouTube](https://www.youtube.com/watch?v=nxiHAN3ijic&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=110) [extra]

### CAN & CAN FD

- [ ] [Video: "Microchip University - CAN and CAN FD Protocol and Physical Layer Basics", Microchip University](https://mu.microchip.com/understanding-the-can-fd-protocol) [beginner]
- [ ] [Article: "CAN bus in 2024: Operation, Advantages and Recent Developments", parlezvoustech](https://www.parlezvoustech.com/en/bus-can-2024-technologie-avantages-evolutions/) [beginner] [alt]
- [ ] [Video: "CAN Bus: Serial Communication - How It Works?", YouTube](https://www.youtube.com/watch?v=JZSCzRT9TTo&t=21s) [beginner] [alt]
- [ ] [Video: "CAN Bus: A Beginners Guide Part 1", YouTube](https://www.youtube.com/watch?v=YBrU_eZM110) [beginner] [alt]
- [ ] [Video: "CAN Bus: A Beginners Guide Part 2", YouTube](https://www.youtube.com/watch?v=z5CVljiLhvc) [beginner] [alt]
- [ ] [Video: "Improving my electric longboard with a CAN Bus! What can the CAN Bus do? EB#44", YouTube](https://www.youtube.com/watch?v=PL0TPdrhMuI)
- [ ] [Video: "CAN Bus, OBD2 & J1939 Explained (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLpV68vjf4Xo4vZ_SjJ6tTlomYm-k18vDZ)
- [ ] [Video: "J1939 Explained - A Simple Intro [v2.0 | 2021]", YouTube](https://www.youtube.com/watch?v=vlqxu9ojbHg) [extra]
- [ ] [Video: "Unified Diagnostic Services (UDS) Explained - A Simple Intro [2022]", YouTube](https://www.youtube.com/watch?v=CV_B8tJgI5E) [extra]
- [ ] [Video: "Microchip University - Designing and Implementing a CAN FD Network", Microchip University](https://mu.microchip.com/designing-and-implementing-a-can-fd-network) [reference]

### RS-485 & Modbus

- [ ] [Video: "What is Modbus and How does it Work?", YouTube](https://www.youtube.com/watch?v=txi2p5_OjKU)
- [ ] [Video: "How does Modbus Communication Protocol Work?", YouTube](https://www.youtube.com/watch?v=JBGaInI-TG4) [alt]
- [ ] [Video: "MODBUS STM32 (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLfIJKC1ud8ggRvaEsMjSEDazoBAnY4MUv)
- [ ] [Video: "What is RS485 and How it's used in Industrial Control Systems?", YouTube](https://www.youtube.com/watch?v=3wgKcUDlHuM)
- [ ] [Video: "What is RS-485?", YouTube](https://www.youtube.com/watch?v=bt9Px51eP6s)
- [ ] [Video: "RS-485 Circuit Implementation", YouTube](https://www.youtube.com/watch?v=bTQFsAXhGqU) [extra]

### USB

- [ ] [Video: "Microchip University - Introduction to USB 2.0", Microchip University](https://mu.microchip.com/introduction-to-usb-20) [beginner]
- [ ] [Video: "Microchip University - USB 3 Fundamentals", Microchip University](https://mu.microchip.com/usb-3-fundamentals) [beginner] [alt]
- [ ] [Video: "Training - USB 101 - Introduction to USB", YouTube](https://www.youtube.com/watch?v=5S6ZPmtPzRA)
- [ ] [Link: "USB 101: An Introduction to Universal Serial Bus 2.0", infineon](https://www.infineon.com/dgdl/Infineon-AN57294_USB_101_An_Introduction_to_Universal_Serial_Bus_2.0-ApplicationNotes-v09_00-EN.pdf?fileId=8ac78c8c7cdc391c017d072d8e8e5256) [alt]
- [ ] [Video: "How does a USB keyboard work?", YouTube](https://youtu.be/wdgULBpRoXk)
- [ ] [Video: "How does USB device discovery work?", YouTube](https://www.youtube.com/watch?v=N0O5Uwc3C0o) [alt]
- [ ] [Video: "MOOC - STM32 USB training (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLnMKNibPkDnFFRBVD206EfnnHhQZI4Hxa) [alt]
- [ ] [Video: "Microchip University - USB2 Hub Fundamentals", Microchip University](https://mu.microchip.com/usb2-hub-fundamentals)
- [ ] [Link: "Beyond Logic - USB in a NutShell", beyondlogic](https://www.beyondlogic.org/usbnutshell/usb1.shtml) [extra]
- [ ] [Article: "USB for Software Developers: An introduction to writing userspace USB drivers", werwolv](https://werwolv.net/posts/usb_for_sw_devs/) [extra]

### Ethernet & Sockets

- [ ] [Video: "Microchip University - Ethernet Fundamentals", Microchip University](https://mu.microchip.com/ethernet-fundamentals) [beginner]
- [ ] [Article: "How the Ethernet Protocol Works – A Complete Guide", freecodecamp](https://www.freecodecamp.org/news/the-complete-guide-to-the-ethernet-protocol/)
- [ ] [Video: "What is an Ethernet PHY?", YouTube](https://www.youtube.com/watch?v=JH3cMYErmKI)
- [ ] [Video: "The Data Link Layer, MAC Addressing, and the Ethernet Frame", YouTube](https://www.youtube.com/watch?v=_b4dXKB8Pt8)
- [ ] [Video: "Microchip University - Serializer/Deserializer (SerDes) Basics for Your Next Microchip Ethernet PHY Design", Microchip University](https://mu.microchip.com/serializerdeserializer-serdes-basics-for-your-next-microchip-ethernet-phy-design) [extra]
- [ ] [Video: "Microchip University - Ethernet Switch Fundamentals", Microchip University](https://mu.microchip.com/ethernet-switch-fundamentals) [extra]
- [ ] [Video: "Networking Fundamentals - Practical Networking (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLIFyRwBY_4bRLmKfP1KnZA6rZbRHtxmXi) [alt]
- [ ] [Video: "TCP vs UDP - Explaining Facts and Debunking Myths - TCP Masterclass", YouTube](https://www.youtube.com/watch?v=jE_FcgpQ7Co) [alt]
- [ ] [Video: "TCP - 12 simple ideas to explain the Transmission Control Protocol", YouTube](https://www.youtube.com/watch?v=JFch3ctY6nE) [extra]
- [ ] [Video: "UDP doesn't suck! It's the BEST L4 protocol for THESE types of applications...", YouTube](https://www.youtube.com/watch?v=LaDRWycC7Iw) [extra]
- [ ] [Video: "Networking tutorial - Ben Eater (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLowKtXNTBypH19whXTVoG3oKSuOcw_XeW) [alt]
- [ ] [Link: "tcpdump & libpcap libraries", tcpdump](https://www.tcpdump.org/) [extra]
- [ ] [Link: "lwIP - A Lightweight TCP/IP stack", savannah.nongnu](https://savannah.nongnu.org/projects/lwip/) [extra]
- [ ] [Link: "lwIP (ESP-IDF)", Espressif](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/lwip.html) [extra]
- [ ] [Link: "Developing applications on STM32Cube with LwIP TCP/IP stack", st](https://www.st.com/resource/en/user_manual/um1713-developing-applications-on-stm32cube-with-lwip-tcpip-stack-stmicroelectronics.pdf) [extra]
- [ ] [Article: "Understanding Traceroute", tech.stonecharioteer](https://tech.stonecharioteer.com/posts/2026/traceroute/) [extra]

### Bluetooth & BLE

- [ ] [Video: "Microchip University - First Steps into Bluetooth Low Energy (BLE)", Microchip University](https://mu.microchip.com/first-steps-into-bluetooth-low-energy-ble) [beginner]
- [ ] [Article: "Bluetooth Basics", sparkfun](https://learn.sparkfun.com/tutorials/bluetooth-basics/all)
- [ ] [Article: "Bluetooth Low Energy: A Primer", Memfault Interrupt](https://interrupt.memfault.com/blog/bluetooth-low-energy-a-primer)
- [ ] [Article: "A Practical Guide to BLE Throughput", Memfault Interrupt](https://interrupt.memfault.com/blog/ble-throughput-primer)
- [ ] [Video: "SparkFun According to Pete #49 - How Bluetooth Works", YouTube](https://www.youtube.com/watch?v=zJqGLWQGyvk) [extra]
- [ ] [Link: "Bluetooth Low Energy Fundamentals - Nordic Semiconductor", Nordic Academy](https://academy.nordicsemi.com/courses/bluetooth-low-energy-fundamentals/) [alt]

### Wi-Fi

- [ ] [Video: "802.11 How WiFi Works - Wireless Networks | Computer Networks Ep. 7.3 | Kurose & Ross", YouTube](https://www.youtube.com/watch?v=vvhEnr52UOU)
- [ ] [Video: "802.11 Frame Analysis", YouTube](https://www.youtube.com/watch?v=ITAJb3v5VKQ)
- [ ] [Link: "Wi-Fi Driver - ESP-IDF Programming Guide", Espressif](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/wifi.html)
- [ ] [Article: "ESP32 Set an Access Point (AP) using ESP-IDF", esp32tutorials](https://esp32tutorials.com/esp32-access-point-ap-esp-idf/)
- [ ] [Article: "ESP32 ESP-IDF Connect with WiFi – Station Mode Example", esp32tutorials](https://esp32tutorials.com/esp32-esp-idf-connect-wifi-station-mode-example/) [extra]

### MQTT & CoAP

- [ ] [Video: "#144 Internet Protocols: CoAP vs MQTT, Network Sniffing, and preparation for IKEA Tradfri Hacking", YouTube](https://www.youtube.com/watch?v=pfG8uEDZj5g)
- [ ] [Video: "MQTT vs. CoAP | Comparison of IoT Protocols", YouTube](https://www.youtube.com/watch?v=0CORpVSUQe0)
- [ ] [Video: "Simple ESP32 IoT Sensor Node Tutorial: WiFi Enabled MQTT Sensor Data Node", YouTube](https://www.youtube.com/watch?v=x5A5S0hoyJ0)
- [ ] [Link: "Cellular IoT Fundamentals - Nordic Semiconductor", Nordic Academy](https://academy.nordicsemi.com/courses/cellular-iot-fundamentals/)

### SD Cards & File Systems

- [ ] [Video: "Interfacing with an SD Card", YouTube](https://www.youtube.com/watch?v=g40tUdjZ-Sk)
- [ ] [Video: "What is a eMMC? Intro, Comparing to Other Storage, and Upgrading. SSD, M.2", YouTube](https://www.youtube.com/watch?v=vGatKmqYxEA)
- [ ] [Article: "SDIO Protocol", prodigytechno](https://prodigytechno.com/sdio-protocol/)
- [ ] [Article: "Interface SD CARD with SDIO in STM32", controllerstech](https://controllerstech.com/interface-sd-card-with-sdio-in-stm32/)
- [ ] [Link: "SDIO Card Slave Driver - ESP32 - Technical Documents", Espressif](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/sdio_slave.html) [extra]
- [ ] [Article: "Flash filesystems", hugh712.gitbooks](https://hugh712.gitbooks.io/embeddedsystem/content/flash_filesystems.html) [extra]
- [ ] [Article: "Block filesystems", hugh712.gitbooks](https://hugh712.gitbooks.io/embeddedsystem/content/block_filesystems.html) [extra]
- [ ] [Article: "Understanding the UBI File System in Embedded Devices", serhack](https://serhack.me/articles/understanding-ubi-file-system-embedded-devices-reolink/) [extra]
- [ ] [Article: "UBI File System", kernel.org](https://docs.kernel.org/filesystems/ubifs.html) [extra]
- [ ] [Article: "JFFS : The Journalling Flash File System", sourceware](https://sourceware.org/jffs2/jffs2-html/) [extra]
- [ ] [Article: "Preventing Filesystem Corruption In Embedded Linux", embeddedts](https://www.embeddedts.com/assets/preventing-filesystem-corruption-in-embedded-linux) [extra]
- [ ] [Link: "LittleFS - A high-integrity embedded file system", os.mbed](https://os.mbed.com/blog/entry/littlefs-high-integrity-embedded-fs/) [extra]
- [ ] [Link: "SPIFS - Wear-leveled SPI flash file system for embedded devices", GitHub](https://github.com/pellepl/spiffs) [extra]

### Project Gate — Sensing and CAN: The Part Employers Recognise

> Give cellguard a voice on the bus that every vehicle uses, and a driver that survives a sensor misbehaving.

**What you are building**

An **I2C driver for a battery front-end** (voltages and temperature) with real error handling, and
a **CAN layer** that encodes and decodes a small DBC-style message set with proper signal packing -
scale, offset, endianness, signedness.

Then you fuzz the decoder until it cannot be crashed.

**Why this is worth showing**

CAN with correct signal packing is directly employable in automotive, EV and industrial work, and
it is the single most recognisable skill on this list. The fuzzing is what makes it senior: most
candidates decode the happy path and stop.

**Expected output**

```text
$ ./tools/candump-replay logs/pack_charge.log
0x18F001 [8]  22 01 A4 06 32 00 00 7F
  -> CellVoltage_01 = 3.874 V   (raw 0x0122, scale 0.001, offset 0)
  -> PackCurrent    = -12.4 A   (raw 0x06A4, signed, scale 0.1)
  -> PackTemp       = 25.0 C    (raw 0x32,   offset -40)
  -> State          = CHARGING

$ make fuzz
24 000 malformed frames in 3.2 s: 0 crashes, 0 out-of-bounds reads
  truncated ....... 8 000 rejected cleanly
  bad DLC ......... 8 000 rejected cleanly
  garbage payload . 8 000 decoded to clamped values
```

**What makes it stand out**

Handle the ugly cases and say so in the README: an I2C slave that NAKs forever, a bus stuck low, a
sensor returning 0xFFFF. Show that the driver reports an error and the system keeps running instead
of hanging. **Never hanging** is the property that gets firmware shipped.

**Definition of done**

- [ ] Gate: Write an I2C driver for a battery front-end that never blocks forever
- [ ] Gate: Handle NAK, bus-busy and timeout explicitly, returning errors to the caller
- [ ] Gate: Define a small CAN message set with scale, offset, endianness and sign
- [ ] Gate: Encode and decode it with a round-trip test for every signal
- [ ] Gate: Fuzz the decoder with truncated, wrong-DLC and garbage frames - zero crashes
- [ ] Gate: Replay a recorded CAN log and print decoded engineering values
- [ ] Gate: Document the failure behaviour of every sensor error path in the README

---

## Stage 5 — RTOS & Firmware Architecture

> Once one loop is not enough: scheduling, concurrency, and how to structure firmware so it survives its second year. Moved to the Reference Shelf: Other RTOSes Worth Knowing.

### Operating System Fundamentals

- [ ] [Article: "Putting the “You” in CPU", cpu.land](https://cpu.land/) [beginner]
- [ ] [Article: "Operating System in 1,000 Lines", operating-system-in-1000-lines.vercel.app](https://operating-system-in-1000-lines.vercel.app/en/) [beginner] [alt]
- [ ] [Book: "The little book about OS development", littleosbook.github](https://littleosbook.github.io/) [beginner] [alt]
- [ ] [Book: "Operating Systems: From 0 to 1", GitHub](https://github.com/tuhdo/os01/blob/master/Operating_Systems_From_0_to_1.pdf) [beginner] [alt]
- [ ] [Link: "An operating system", GitHub](https://github.com/roscopeco/anos)
- [ ] [Article: "Porting Mac OS X to the Nintendo Wii", bryankeller.github](https://bryankeller.github.io/2026/04/08/porting-mac-os-x-nintendo-wii.html)
- [ ] [Article: "Writing an OS in Rust - Philipp Oppermann's blog", os.phil-opp](https://os.phil-opp.com/) [extra]
- [ ] [Link: "Operating System development tutorials in Rust on the Raspberry Pi", GitHub](https://github.com/rust-embedded/rust-raspberrypi-OS-tutorials) [extra]
- [ ] [eBook: "Bare-metal C programming on ARM", GitHub](https://github.com/umanovskis/baremetal-arm) [extra]
- [ ] [eBook: "Practical Guide to Bare Metal C++", GitBook](https://arobenko.gitbooks.io/bare_metal_cpp/content/) [extra]
- [ ] [Book: "Operating Systems: Three Easy Pieces - Remzi H Arpaci-Dusseau, Andrea C Arpaci-Dusseau", pages.cs.wisc](https://pages.cs.wisc.edu/~remzi/OSTEP/) [reference]

### RTOS Concepts

- [ ] [Article: "Bare-metal and RTOS Based Embedded Systems", microcontrollerslab](https://microcontrollerslab.com/difference-bare-metal-and-rtos-based-embedded-systems/)
- [ ] [Article: "RTOS vs. Bare Metal: Navigating Performance, Complexity, and Efficiency", weston-embedded](https://weston-embedded.com/support/media-articles/119-rtos-vs-bare-metal-navigating-performance-complexity-and-efficiency)
- [ ] [Article: "The Pros and Cons of RTOS vs Bare Metal: Which Will You Choose?", medium](https://medium.com/@lanceharvieruntime/the-pros-and-cons-of-rtos-vs-bare-metal-which-will-you-choose-756e33ba6df7)
- [ ] [Article: "FreeRTOS vs Linux for Embedded Systems", bytesnap](https://www.bytesnap.com/news-blog/freertos-vs-linux-embedded-systems/)
- [ ] [Link: "tinyOS RTOS", GitHub](https://github.com/cmc-labo/tinyos-rtos) [extra]
- [ ] [Link: "Real-Time Systems Concepts", micrium.atlassian](https://micrium.atlassian.net/wiki/spaces/osiidoc/pages/163855/Real-Time+Systems+Concepts) [extra]
- [ ] [Link: "RTOS Fundamentals", FreeRTOS](https://www.freertos.org/Documentation/01-FreeRTOS-quick-start/01-Beginners-guide/01-RTOS-fundamentals) [extra]
- [ ] [Article: "A Simple Scheduler via an Interrupt-driven Actor Model", Memfault Interrupt](https://interrupt.memfault.com/blog/hardware-actor-scheduler) [extra]
- [ ] [Article: "ARM Cortex-M RTOS Context Switching", Memfault Interrupt](https://interrupt.memfault.com/blog/cortex-m-rtos-context-switching) [extra]
- [ ] [Video: "RTOS (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLPW8O6W-1chyrd_Msnn4LD6LBs2slJITs) [extra]
- [ ] [Video: "Beyond the RTOS (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLPW8O6W-1chytjkg63-tM7MI0BvGxxPIP) [extra]
- [ ] [Blog: "RTOS", Barr Group](https://barrgroup.com/blog-tag/rtos) [extra]

### FreeRTOS

- [ ] [Video: "Introduction to RTOS (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLEBQazB0HUyQ4hAPU1cJED6t3DU0h34bz) [beginner]
- [ ] [Video: "Microchip University - FreeRTOS Simplified: A Beginner's Guide to Develop and Debug FreeRTOS Applications", Microchip University](https://mu.microchip.com/freertos-simplified) [beginner] [alt]
- [ ] [Link: "FreeRTOS - Market leading RTOS", FreeRTOS](https://www.freertos.org)
- [ ] [Video: "Getting Started With STM32 and Nucleo Part 3: FreeRTOS - How To Run Multiple Threads w/ CMSIS-RTOS", YouTube](https://www.youtube.com/watch?v=CdpgqpuPSyQ)
- [ ] [Link: "SafeRTOS - Safety Critical Real-Time OS", FreeRTOS](https://www.freertos.org/FreeRTOS-Plus/Safety_Critical_Certified/SafeRTOS.html)
- [ ] [Book: "Mastering the FreeRTOS Real Time Kernel - a Hands On Tutorial Guide", FreeRTOS](https://www.freertos.org/Documentation/RTOS_book.html) [reference] [alt]

### Zephyr

- [ ] [Link: "Zephyr® Project", zephyrproject](https://www.zephyrproject.org/)
- [ ] [Link: "Zephyr: Tutorial for Beginners", maksimdrachov.github](https://maksimdrachov.github.io/zephyr-rtos-tutorial/)
- [ ] [Article: "Why We Moved from FreeRTOS to Zephyr RTOS", zephyrproject](https://www.zephyrproject.org/why-we-moved-from-freertos-to-zephyr-rtos/) [extra]
- [ ] [Link: "nRF Connect SDK", Nordic Academy](https://academy.nordicsemi.com/courses/nrf-connect-sdk-fundamentals/) [extra]
- [ ] [Video: "ESP32 on Zephyr OS (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLEQVp_6G_y4iFfemAbFsKw6tsGABarTwp) [alt]
- [ ] [Article: "Getting Started With Zephyr", EmbeddedRelated](https://www.embeddedrelated.com/showarticle/1505.php) [reference]
- [ ] [Video: "Introduction to Zephyr - Digikey (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLEBQazB0HUyTmK2zdwhaf8bLwuEaDH-52) [reference]

### Concurrency Primitives

- [ ] [Video: "Semaphores", YouTube](https://www.youtube.com/watch?v=70auqrv84y8)
- [ ] [Video: "Producer Consumer Pattern", YouTube](https://www.youtube.com/watch?v=VXJSJ6c3ZIs)
- [ ] [Video: "Quick explanation: the Bounded-Buffer problem", YouTube](https://www.youtube.com/watch?v=LRiN3DJdskA)

### State Machines & Event-Driven Design

- [ ] [Article: "Programming embedded systems the easy way – with state machines", Embedded.com](https://www.embedded.com/programming-embedded-systems-the-easy-way-with-state-machines/)
- [ ] [Article: "“Input-Driven” vs. Event-Driven State Machines", Quantum Leaps](https://www.state-machine.com/input-driven-vs-event-driven-state-machines)
- [ ] [Article: "State Machines for Event-Driven Systems", Barr Group](https://barrgroup.com/embedded-systems/how-to/state-machines-event-driven-systems) [alt]
- [ ] [Video: "Embedded Programming Lesson 33: Event-Driven Programming part-1", YouTube](https://www.youtube.com/watch?v=rfb2JI1GGIc)
- [ ] [Video: "Embedded Programming Lesson 34: Event-Driven Programming part-2", YouTube](https://www.youtube.com/watch?v=l69ghMpsp6w) [extra]
- [ ] [Video: "State Machines (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLPW8O6W-1chxym7TgIPV9k5E8YJtSBToI) [reference]
- [ ] [Video: "Event-Driven Programming (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLPW8O6W-1chx8Y7Oq2gOE0NUPXmQxu2Wr) [reference] [alt]

### Design Patterns for Firmware

- [ ] [Article: "Practical Design Patterns: Opaque Pointers and Objects in C", Memfault Interrupt](https://interrupt.memfault.com/blog/opaque-pointers)
- [ ] [Link: "Design Patterns - Refactoring Guru", refactoring.guru](https://refactoring.guru/design-patterns)
- [ ] [Book: "Making Embedded Systems: Design Patterns for Great Software - Elecia White", oreilly](https://www.oreilly.com/library/view/making-embedded-systems/9781449308889/) [reference]
- [ ] [Link: "Making Embedded Systems: Design Patterns for Great Software - Elecia White (Audio Book)", audiobooks](https://www.audiobooks.com/audiobook/making-embedded-systems-design-patterns-for-great-software/814297) [reference] [alt]

### Embedded GUI

- [ ] [Link: "U8glib library for monochrome displays, version 2", GitHub](https://github.com/olikraus/u8g2)
- [ ] [Link: "LVGL", lvgl](https://lvgl.io/)
- [ ] [Link: "TouchGFX", support.touchgfx](https://support.touchgfx.com/4.20/docs/introduction/welcome)
- [ ] [Video: "Introduction to Qt / QML (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PL6CJYn40gN6hdNC1IGQZfVI707dh9DPRc)

### Project Gate — RTOS Architecture You Can Defend

> Restructure cellguard into tasks and prove you understand scheduling - by causing a priority inversion on purpose, measuring it, and fixing it.

**What you are building**

cellguard moves from a superloop to an **RTOS**: a sampling task, a CAN task, a control task and a
logger, communicating only through queues. Then you size every stack from measured evidence rather
than guesswork.

**Why this is worth showing**

"I used FreeRTOS" is on every CV. **"Here is the priority inversion I induced, the trace showing
the deadline miss, and the mutex change that fixed it"** is on almost none. That single
demonstration is worth more than the rest of the stage.

**Expected output**

A task table in the README, justified rather than guessed:

| Task | Prio | Period | Stack used / allocated | Worst latency |
|---|---:|---:|---:|---:|
| adc_sample | 4 | 1 ms | 412 / 768 B | 180 us |
| can_tx | 3 | 10 ms | 508 / 1024 B | 1.2 ms |
| control | 2 | 20 ms | 640 / 1024 B | 3.8 ms |
| logger | 1 | idle | 320 / 512 B | - |

```text
$ make demo-inversion
[  0.000] control (prio 2) takes sensor_mutex
[  0.002] adc_sample (prio 4) blocks on sensor_mutex
[  0.041] logger (prio 1) preempts control  <-- inversion
[  0.043] adc_sample DEADLINE MISSED by 39 ms
--- enabling priority inheritance ---
[  0.002] adc_sample blocks; control boosted 2 -> 4
[  0.003] adc_sample runs. worst latency 1.1 ms. no misses.
```

**What makes it stand out**

Stack high-water marks. Reporting *used vs allocated* proves you measured instead of picking 1024
because it looked safe - and it is a number a reviewer can immediately trust.

**Definition of done**

- [ ] Gate: Restructure the firmware into RTOS tasks with explicit priorities and periods
- [ ] Gate: Make tasks communicate only through queues - no shared globals
- [ ] Gate: Measure stack high-water marks and size every stack from that evidence
- [ ] Gate: Induce a priority inversion deliberately and capture the deadline miss
- [ ] Gate: Fix it with priority inheritance and show the before/after trace
- [ ] Gate: Publish the task table with worst-case latency in the README
- [ ] Gate: Justify every priority choice in one line each

---

## Stage 6 — Production Firmware Engineering

> The gap between hobby firmware and shipped firmware: tests, CI, updates, safety and security.

### Testing Embedded Software

- [ ] [Article: "Embedded Testing", artoftesting](https://artoftesting.com/embedded-testing)
- [ ] [Article: "What is Embedded Testing in Software Testing?", guru99](https://www.guru99.com/embedded-software-testing.html)
- [ ] [Article: "Verification vs Validation in Embedded Software", parasoft](https://www.parasoft.com/blog/verification-vs-validation-in-embedded-software/)

### Test-Driven Development

- [ ] [Article: "Testing: Unit VS Integration VS Regression VS Acceptance", medium](https://medium.com/@touseefmurtaza1993/testing-unit-vs-integration-vs-regression-vs-acceptance-a3e190cc54dd)
- [ ] [Article: "Firmware Testing with Renode and GitHub Actions", Memfault Interrupt](https://interrupt.memfault.com/blog/test-automation-renode)
- [ ] [Article: "Balancing Test Coverage vs. Overhead", Memfault Interrupt](https://interrupt.memfault.com/blog/testing-vs-overhead)
- [ ] [Book: "Test Driven Development for Embedded C - James Grenning", amazon](https://www.amazon.com/Driven-Development-Embedded-Pragmatic-Programmers/dp/193435662X) [reference]

### Unit Testing & Mocking

- [ ] [Article: "Embedded C/C++ Unit Testing Basics", Memfault Interrupt](https://interrupt.memfault.com/blog/unit-testing-basics)
- [ ] [Article: "Embedded C/C++ Unit Testing with Mocks", Memfault Interrupt](https://interrupt.memfault.com/blog/unit-test-mocking) [alt]
- [ ] [Link: "Unit Testing for C (especially Embedded Software)", ThrowTheSwitch](http://www.throwtheswitch.org/unity)
- [ ] [Article: "How to Use Ceedling for Embedded Test-Driven Development", electronvector](https://www.electronvector.com/how-to-use-ceedling-for-embedded-test-driven-development)
- [ ] [Link: "Catch2 - A modern, C++-native, test framework for unit-tests", GitHub](https://github.com/catchorg/Catch2)
- [ ] [Link: "pytest-embedded", Espressif](https://docs.espressif.com/projects/pytest-embedded/en/latest/) [extra]
- [ ] [Article: "Introduction to testing ESP32 code with Pytest", gistre.epita.fr](https://blog.gistre.epita.fr/posts/brice.parent-2023-09-11-introduction_to_testing_esp32_code_with_pytest/) [extra]
- [ ] [Link: "Pigweed", Pigweed](https://pigweed.dev/) [extra]
- [ ] [Link: "GoogleTest - Google Testing and Mocking Framework", GitHub](https://github.com/google/googletest) [extra]
- [ ] [Link: "GoogleTest User’s Guide", google.github](https://google.github.io/googletest/) [extra]
- [ ] [Video: "GoogleTest And GoogleMock (GTest and GMock)", YouTube](https://www.youtube.com/playlist?list=PLHn7_PzMqzs5JE58kw4nWiFELEkQek5G0) [extra]

### Integration, SIL & HIL Testing

- [ ] [Article: "Hardware CI Arena", electricui](https://electricui.com/blog/hardware-testing)
- [ ] [Article: "Exclave: Hardware Testing in Mass Production, Made Easier", bunniestudios](https://www.bunniestudios.com/blog/?p=5450)
- [ ] [Article: "Regression Testing of Embedded Systems", parasoft](https://www.parasoft.com/blog/regression-testing-of-embedded-systems/)
- [ ] [Article: "Hardware-in-Loop and Software-in-Loop Testing", roboticsknowledgebase](https://roboticsknowledgebase.com/wiki/system-design-development/In-Loop-Testing/)
- [ ] [Video: "Embedded CI/CD with HIL Testing (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PL4cGeWgaBTe1uwiqIAc6fwPzPpvgPZI2J) [extra]

### CI/CD for Firmware

- [ ] [Video: "Intro to CI/CD Part 2: Getting Started with GitHub Actions | Digi-Key Electronics", YouTube](https://youtu.be/8pyqbYDYkRs)
- [ ] [Article: "How to Build a Continuous Integration and Delivery Process for Embedded Software", medium](https://medium.com/jumperiot/how-to-build-a-continuous-integration-and-delivery-flow-for-embedded-software-b0b5bf220a2)
- [ ] [Article: "A guide to continuous delivery in embedded development", Embedded.com](https://www.embedded.com/a-guide-to-continuous-delivery-in-embedded-development/)
- [ ] [Video: "Continuous Delivery for Embedded Systems • Mike Long • GOTO 2015", YouTube](https://www.youtube.com/watch?v=DcFe6cEvnGQ) [extra]
- [ ] [Article: "Continuous Integration & Continuous Delivery for Embedded Systems (Whitepaper)", parasoft](https://www.parasoft.com/white-paper/ci-cd-for-embedded-systems/) [extra]
- [ ] [Article: "What is DevOps in an Embedded Device Company?", linkedin](https://www.linkedin.com/pulse/what-devops-embedded-device-company-john-macdonald/) [extra]
- [ ] [Video: "CI/CD Tutorials (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLy7NrYWoggjzSIlwxeBbcgfAdYoxCIrM2) [reference]

### Coding Standards, MISRA & Static Analysis

- [ ] [Article: "Intro to Embedded Development: Styles and Standards", All About Circuits](https://www.allaboutcircuits.com/technical-articles/embedded-programming-styles-and-standards/)
- [ ] [Article: "Safety Standards and Certifications for Embedded Systems Development", linkedin](https://www.linkedin.com/pulse/safety-standards-certifications-embedded-systems-development/)
- [ ] [Video: "Microchip University - An Introduction To The ISA/IEC 62443 Standard", Microchip University](https://mu.microchip.com/an-introduction-to-the-isaiec-62443-standard)
- [ ] [Video: "Exploring EMC Basics & Standards", YouTube](https://www.youtube.com/watch?v=duhBkhlH-WY)
- [ ] [Blog: "Coding Standards", Barr Group](https://barrgroup.com/blog-tag/coding-standards) [extra]
- [ ] [Video: "An Introduction to MISRA C - Excerpt from An Introduction to MISRA C:2012 Webinar", YouTube](https://www.youtube.com/watch?v=6a9Fwvvp92I) [extra]
- [ ] [Video: "Static Code Analysis: Scan All Your Code For Bugs", YouTube](https://www.youtube.com/watch?v=Heor8BVa4A0) [extra]
- [ ] [Article: "Optimizing Your Code", Barr Group](https://barrgroup.com/embedded-systems/books/programming-embedded-systems/code-optimization-size-speed) [extra]

### Functional Safety

- [ ] [Video: "Microchip University - Introduction to Functional Safety", Microchip University](https://mu.microchip.com/introduction-to-functional-safety) [beginner]
- [ ] [Article: "A Guide to MISRA C Coding Standards - MISRA C and MISRA C++", perforce](https://www.perforce.com/resources/qac/misra-c-cpp)
- [ ] [Article: "A Firmware Development Standard by Jack Ganssle", ganssle](http://www.ganssle.com/fsm.htm)
- [ ] [Article: "Safety-critical Embedded systems: How to prepare for software development", nagarro](https://www.nagarro.com/en/blog/embedded-software-development-safety-critical-systems)
- [ ] [Article: "DO-178C - Software Considerations in Airborne Systems and Equipment Certification", en.wikipedia](https://en.wikipedia.org/wiki/DO-178C) [extra]

### Bootloaders & Firmware Update

- [ ] [Video: "Microchip University - Design Considerations For Your First IoT Project", Microchip University](https://mu.microchip.com/design-considerations-for-your-first-iot-project) [beginner]
- [ ] [Article: "Basics to Developing Bootloader for Arduino", electronicwings](https://www.electronicwings.com/arduino/basics-to-developing-bootloader-for-arduino)
- [ ] [Article: "From Zero to main(): How to Write a Bootloader from Scratch", Memfault Interrupt](https://interrupt.memfault.com/blog/how-to-write-a-bootloader-from-scratch)
- [ ] [Video: "How to Create a Super Simple Bootloader", YouTube](https://www.youtube.com/watch?v=OkUQ3iMmiYQ&list=PLnMKNibPkDnEb1sphpdFJ3bR9dNy7S6mO) [extra]
- [ ] [Video: "Blinky To Bootloader: Bare Metal Programming Series (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLP29wDx6QmW7HaCrRydOnxcy8QmW0SNdQ) [alt]
- [ ] [Article: "Simple AVR Bootloader tutorial", pocketmagic](https://www.pocketmagic.net/simple-avr-bootloader-tutorial/) [extra]
- [ ] [Article: "Saving bandwidth with delta firmware updates", Memfault Interrupt](https://interrupt.memfault.com/blog/ota-delta-updates) [extra]
- [ ] [Article: "Delta Over-The-Air Device Firmware Update", thinkty](https://thinkty.net/projects/2023/05/07/delta_ota.html) [extra]
- [ ] [Article: "FreeRTOS Delta Over-the-Air Updates", FreeRTOS](https://www.freertos.org/2022/01/delta-over-the-air-updates.html) [extra]
- [ ] [Link: "ESP Delta OTA", components.espressif](https://components.espressif.com/components/espressif/esp_delta_ota) [extra]
- [ ] [Article: "Device Firmware Update Cookbook", Memfault Interrupt](https://interrupt.memfault.com/blog/device-firmware-update-cookbook) [reference]

### Cryptography for Devices

- [ ] [Video: "Microchip University - Cryptography Primer", Microchip University](https://mu.microchip.com/cryptography-primer) [beginner]
- [ ] [Video: "Hashing, Hashing Algorithms, and Collisions - Cryptography - Practical TLS", YouTube](https://youtu.be/HHQ2QP_upGM)
- [ ] [Video: "Data Integrity - How Hashing is used to ensure data isn't modified - HMAC - Cryptography", YouTube](https://www.youtube.com/watch?v=doN3lzzNEIM)
- [ ] [Video: "Encryption - Symmetric Encryption vs Asymmetric Encryption - Cryptography - Practical TLS", YouTube](https://www.youtube.com/watch?v=o_g-M7UBqI8) [extra]
- [ ] [Video: "Public and Private Keys - Signatures & Key Exchanges - Cryptography - Practical TLS", YouTube](https://youtu.be/_zyKvPvh808) [extra]
- [ ] [Video: "Understanding AES Encryption Mechanics: BMPS", YouTube](https://youtu.be/OnhtzFJW_4I) [extra]
- [ ] [Video: "MOOC - Security Part2: Basics of cryptography (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLnMKNibPkDnFSFh57UFTZLpy-7lZiwTHh) [alt]
- [ ] [Video: "MOOC - Security Part3 : STM32 security features (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLnMKNibPkDnFzux3PHKUEi14ftDn9Cbm7) [alt]
- [ ] [Article: "Introduction to encryption for embedded Linux developers", Sergio Prado](https://sergioprado.blog/introduction-to-encryption-for-embedded-linux-developers/) [extra]
- [ ] [Article: "A hands-on approach to symmetric-key encryption", Sergio Prado](https://sergioprado.blog/a-hands-on-approach-to-symmetric-key-encryption/) [extra]
- [ ] [Article: "Asymmetric-Key Encryption and Digital Signatures in Practice", Sergio Prado](https://sergioprado.blog/asymmetric-key-encryption-and-digital-signatures-in-practice/) [extra]
- [ ] [Book: "Handbook of Applied Cryptography - Alfred J. Menezes, Paul C. van Oorschot, Scott A. Vanstone", cacr.uwaterloo.ca](https://cacr.uwaterloo.ca/hac/) [reference]

### Secure Boot & Signed Updates

- [ ] [Article: "AVR231: AES Bootloader", microchip](https://www.microchip.com/en-us/application-notes/an2462)
- [ ] [Video: "MOOC - Security Part4 : STM32 security in practice (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLnMKNibPkDnF0wt-ZI74SflnsBV4yKzkO)
- [ ] [Video: "MOOC - Security Part5 : How to define your security needs (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLnMKNibPkDnGqh5OmQWw98ztpf9TeczbC) [alt]
- [ ] [Video: "MOOC - Security Part6: STM32 security ecosystem, from theory to practice (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLnMKNibPkDnGd7J7fV7tr-4xIBwkNfD--) [alt]
- [ ] [Video: "TPM (Trusted Platform Module) - Computerphile", YouTube](https://www.youtube.com/watch?v=RW2zHvVO09g)
- [ ] [Video: "Securing Embedded Linux Systems with TPM 2.0 - Philip Tricca, Intel", YouTube](https://www.youtube.com/watch?v=0qu9R7Tlw9o)
- [ ] [Article: "TPM: Basic applications to embedded devices", witekio](https://witekio.com/blog/tpm-basic-applications-to-embedded-devices/) [extra]
- [ ] [Article: "OTA for Embedded Linux Devices: A practical introduction", Memfault Interrupt](https://interrupt.memfault.com/blog/ota-for-embedded-linux-devices) [extra]
- [ ] [Article: "Introduction to Embedded Linux Security - part 1", Sergio Prado](https://sergioprado.blog/introduction-embedded-linux-security-part-1/) [extra]
- [ ] [Article: "Introduction to Embedded Linux Security - part 2", Sergio Prado](https://sergioprado.blog/introduction-embedded-linux-security-part-2/) [extra]

### Attacking Your Own Device

- [ ] [Video: "Hardware Hacking Tutorial (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLoFdAHrZtKkhcd9k8ZcR4th8Q8PNOx7iU)
- [ ] [Link: "The Official WiFi Pineapple Pager Payload Repository", GitHub](https://github.com/hak5/wifipineapplepager-payloads)
- [ ] [Article: "Embedded Systems Security and TrustZone", embeddedsecurity](https://embeddedsecurity.io/)

### How Firmware Teams Work

- [ ] [Article: "What is the software development life cycle?", coderus](https://www.coderus.com/the-software-development-lifecycle/)
- [ ] [Article: "Embedded Product Development Life Cycle: Four Main Steps", sam-solutions](https://www.sam-solutions.com/blog/embedded-product-development-life-cycle/)
- [ ] [Article: "Does agile work with embedded software?", Embedded.com](https://www.embedded.com/does-agile-work-with-embedded-software/)
- [ ] [Article: "Scrum for embedded software: Good – but for reasons other than what your manager thinks", elektrobit](https://www.elektrobit.com/trends/scrum-for-embedded-software/)
- [ ] [Article: "What Is Scrum: A Guide to the Most Popular Agile Framework", scrumalliance](https://www.scrumalliance.org/about-scrum) [extra]
- [ ] [Article: "An agile guide to scrum meetings", atlassian](https://www.atlassian.com/agile/scrum/ceremonies) [extra]
- [ ] [Article: "What is scaled agile framework? (SAFe)", atlassian](https://www.atlassian.com/agile/agile-at-scale/what-is-safe) [extra]
- [ ] [Link: "Jira - Issue & Project Tracking Software", confluence.atlassian](https://confluence.atlassian.com/jira) [extra]
- [ ] [Article: "What is the V model for software development", x-engineer](https://x-engineer.org/v-model-software-development/) [extra]
- [ ] [Article: "V Model In Software Engineering: Ultimate Guideline", biplus](https://biplus.com.vn/v-model-in-software-engineering/) [extra]
- [ ] [Article: "Soft Skills For Embedded Systems Software Developers", EmbeddedRelated](https://www.embeddedrelated.com/showarticle/1470.php) [extra]
- [ ] [Article: "10 Skills Every Embedded Engineer Should Have", medium](https://medium.com/@lanceharvieruntime/10-skills-every-embedded-engineer-should-have-dcb867095b91) [extra]

### Quality & Testing Lectures

- [ ] [Video: "Embedded Software Testing", YouTube](https://www.youtube.com/playlist?list=PL_DQiOR0jhbU3ZKyYIV9oxfcqXTpbK4Le)
- [ ] [Video: "Embedded Security, Safety, and Software Quality", YouTube](https://www.youtube.com/playlist?list=PL_DQiOR0jhbXFZtjw6U-19X0jPDmg4UoR) [alt]

### Project Gate — The Flagship: CI-Tested Firmware With Signed Updates

> Turn cellguard into something that looks shipped: tests written first, an emulator running them on every push, and a signed A/B update that refuses a tampered image.

**What you are building**

The stage that makes the whole repo a portfolio piece rather than a learning exercise:

- the I2C and CAN layers **rebuilt test-first** against a mocked bus
- **GitHub Actions** running unit tests *and* a full Renode boot on every push
- static analysis in the pipeline
- an **A/B bootloader** that verifies a signature before switching banks

**Why this is worth showing**

This is the differentiator. Firmware CI that boots the actual image in an emulator on every commit
is something many working teams do not have. A green badge on your README, backed by a workflow a
reviewer can read, says more about your engineering maturity than any amount of driver code.

**Expected output**

```text
$ gh workflow view ci
build .................. ok   (18.4 kB flash, +112 B vs main)
unit tests ............. 128 passed, 0 failed, 94.1% lines
static analysis ........ cppcheck 0 warnings, clang-tidy 0
renode integration ..... boots, 1 kHz tick verified, CAN round-trip ok
bootloader ............. signed image accepted, tampered image REJECTED
```

```text
$ ./tools/ota-demo.sh
bank A  v1.2.0  (running)
uploading v1.3.0 ....... signature ok      -> staged to bank B
reboot ................. bank B active, v1.3.0 running
uploading v1.4.0-evil .. signature INVALID -> rejected, bank A retained
power cut mid-write .... watchdog reboot, bank A still bootable
```

**What makes it stand out**

The **power-cut test**. Interrupting the update and showing the device still boots the old bank is
the thing a hiring manager who has shipped hardware will notice, because they have been burned by
it. Put that line in the README near the top.

**Definition of done**

- [ ] Gate: Rebuild the I2C and CAN layers test-first against a mocked bus
- [ ] Gate: Reach meaningful branch coverage on error paths, not just the happy path
- [ ] Gate: Run unit tests in GitHub Actions on every push, with a badge in the README
- [ ] Gate: Add a Renode integration job that boots the real image and checks behaviour
- [ ] Gate: Run a static analyser in the pipeline and fix or justify every finding
- [ ] Gate: Report flash and RAM delta against main on every pull request
- [ ] Gate: Build an A/B bootloader that verifies a signature before switching banks
- [ ] Gate: Prove a tampered image is rejected and the previous bank still boots
- [ ] Gate: Prove a power cut mid-update leaves the device bootable

---

## Track A — Embedded Linux

> A different career track from MCU firmware: userspace, drivers, and building your own distribution.

### Embedded Linux Foundations

- [ ] [Video: "Introduction to Embedded Linux (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLEBQazB0HUyTpoJoZecRK6PpDG31Y7RPB) [beginner]
- [ ] [Article: "What Is Embedded Linux?", windriver](https://www.windriver.com/solutions/learning/embedded-linux)
- [ ] [Link: "Linux From Scratch - step-by-step instructions for building your own custom Linux system", linuxfromscratch](https://www.linuxfromscratch.org/) [alt]
- [ ] [Link: "Automotive Grade Linux (AGL)", automotivelinux](https://docs.automotivelinux.org/)
- [ ] [Link: "Real Time Linux and `PREEMPT_RT` Patch", linuxfoundation](https://wiki.linuxfoundation.org/realtime/start)
- [ ] [Link: "Android Open Source Project", source.android](https://source.android.com) [extra]
- [ ] [Link: "Android Automotive", source.android](https://source.android.com/docs/automotive) [extra]

### The Linux Kernel

- [ ] [Book: "The Linux Programming Interface - Michael Kerrisk", man7](https://man7.org/tlpi/) [reference]

### Device Drivers

- [ ] [Book: "The Linux Kernel Module Programming Guide", sysprog21.github](https://sysprog21.github.io/lkmpg/)
- [ ] [Article: "Kernel Driver with Rust in 2022", not-matthias.github](https://not-matthias.github.io/posts/kernel-driver-with-rust/)
- [ ] [Book: "Linux Device Drivers - Jonathan Corbet, Alessandro Rubini, Greg Kroah-Hartman", LWN](https://lwn.net/Kernel/LDD3/) [reference]

### U-Boot

- [ ] [Link: "The U-Boot Documentation", u-boot.readthedocs](https://u-boot.readthedocs.io/en/latest/)
- [ ] [Link: "Barebox", barebox](https://www.barebox.org/doc/latest/index.html)

### Buildroot

- [ ] [Link: "Buildroot Documentation", buildroot](https://buildroot.org/docs.html)
- [ ] [Video: "Introduction to Embedded Linux Part 1 - Buildroot | Digi-Key Electronics", YouTube](https://www.youtube.com/watch?v=9vsu67uMcko)
- [ ] [Article: "Building Tiny Raspberry Pi Linux Images With Buildroot", rickcarlino](https://rickcarlino.com/2021/building-tiny-raspberry-pi-linux-images-with-buildroot.html)

### Yocto

- [ ] [Link: "Yocto Project Quick Build", yoctoproject](https://docs.yoctoproject.org/brief-yoctoprojectqs/index.html)
- [ ] [Video: "Introduction to Embedded Linux Part 2 - Yocto Project | Digi-Key Electronics", YouTube](https://www.youtube.com/watch?v=2-PwskQrZac&t=7s)
- [ ] [Video: "Yocto Project Tutorial Series (Basic to Advance) (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLwqS94HTEwpQmgL1UsSwNk_2tQdzq3eVJ)
- [ ] [Book: "Bootlin Embedded Linux, Kernel, drivers, Yocto, Buildroot and Graphics Training", Bootlin](https://bootlin.com/training/) [extra]
- [ ] [Link: "Yocto Project Documentation", yoctoproject](https://docs.yoctoproject.org/index.html) [reference]

### Threads & IPC

- [ ] [Article: "Threading/Concurrency vs Parallelism", danielmoth](http://www.danielmoth.com/Blog/threadingconcurrency-vs-parallelism.aspx)
- [ ] [Article: "Multi-threading and Parallel Programming", dev.to](https://dev.to/kwereutosu/multi-threading-and-parallel-programming-1l9m)
- [ ] [Article: "Multitasking vs Multithreading vs Multiprocessing", medium](https://medium.com/codex/multitasking-vs-multithreading-vs-multiprocessing-2b0087c861ae)
- [ ] [Article: "D-Bus Tutorial", dbus.freedesktop](https://dbus.freedesktop.org/doc/dbus-tutorial.html)

### Performance

- [ ] [Video: "Introduction to OpenMP - Tim Mattson (Intel) (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLLX-Q6B8xqZ8n8bwjGdzBJ25X2utwnoEG)
- [ ] [Link: "OpenCL Tutorials", intel](https://www.intel.com/content/www/us/en/developer/articles/training/opencl-tutorials.html)
- [ ] [Link: "Mvidia", jaso1024](https://jaso1024.com/mvidia/)
- [ ] [Link: "Every GPU That Mattered", sheets.works](https://sheets.works/data-viz/every-gpu)

### Qt

- [ ] [Link: "Qt Documentation", doc.qt](https://doc.qt.io/)

### Project Gate — A Linux Image and a Driver You Wrote

> Build a bootable embedded Linux system from source and put your own kernel module inside it.

**What you are building**

A minimal **Buildroot** image for an emulated ARM board that boots in QEMU to a shell, containing a
**character device driver you wrote** - exposing the same cell-voltage data as cellguard, so the
two projects tell one story.

**Why this is worth showing**

Embedded Linux is a separate job market from MCU firmware, and "I built the image from source and
wrote the driver in it" answers both halves of the interview. Because it runs in QEMU, a reviewer
can boot your system without a board.

**Expected output**

```text
$ make -C buildroot && ./run-qemu.sh
Booting Linux on physical CPU 0x0
...
cellguard: registered char device major 240
Welcome to cellguard-linux
# cat /dev/cellguard0
cell0=3.874V cell1=3.871V cell2=3.869V temp=25.0C
# dmesg | tail -2
cellguard: open() by pid 412
cellguard: 3 reads, 0 errors
```

**What makes it stand out**

Ship the whole thing as one script. `./run-qemu.sh` downloading nothing and booting straight to
your driver's output is far more convincing than a page of instructions, and it is the same
"a stranger can run it" property that makes the rest of your portfolio work.

**Definition of done**

- [ ] Gate: Build a minimal Buildroot image for an emulated ARM board
- [ ] Gate: Boot it in QEMU and get to a shell
- [ ] Gate: Write a character device driver and load it as a module
- [ ] Gate: Read from your device node in userspace and show the output
- [ ] Gate: Build the driver into the image so it loads at boot
- [ ] Gate: Wrap the whole boot in a single script a reviewer can run

---

## Track B — Automotive & AUTOSAR

> Directly relevant to EV, BMS and vehicle-control work: the architecture, the buses and the safety process.

### AUTOSAR Architecture

- [ ] [Link: "AUTOSAR Standards", autosar](https://www.autosar.org/standards)
- [ ] [Video: "AUTOSAR Basics | AUTOSAR Tutorial | Architecture | Automotive", YouTube](https://www.youtube.com/watch?v=7b5BY1IAfwY)
- [ ] [Video: "Introduction to AUTOSAR", YouTube](https://www.youtube.com/watch?v=NfZI8wvgZPo) [extra]
- [ ] [Article: "OSEK OS Overview", autosartoday](https://www.autosartoday.com/posts/osek_os_overview) [extra]
- [ ] [Link: "OSEK/VDX Operating System Specification 2.2.3", osek-vdx](https://www.osek-vdx.org/mirror/os223.pdf) [reference]
- [ ] [Link: "OSEK/VDX OIL (OSEK Implementation Language) Specification 2.4.1", osek-vdx](https://www.osek-vdx.org/mirror/oil241.pdf) [reference]

### LIN, FlexRay & J1939

- [ ] [Article: "LIN Bus Explained - A Simple Intro", CSS Electronics](https://www.csselectronics.com/pages/lin-bus-protocol-intro-basics) [beginner]
- [ ] [Article: "LIN (Local Interconnect Network)", Wikipedia](https://en.wikipedia.org/wiki/Local_Interconnect_Network)
- [ ] [Article: "FlexRay", Wikipedia](https://en.wikipedia.org/wiki/FlexRay)
- [ ] [Article: "SAE J1939 Explained - A Simple Intro", CSS Electronics](https://www.csselectronics.com/pages/j1939-explained-simple-intro-tutorial)

### Diagnostics (UDS & OBD-II)

- [ ] [Article: "UDS Protocol - Unified Diagnostic Services Intro", CSS Electronics](https://www.csselectronics.com/pages/uds-protocol-tutorial-unified-diagnostic-services) [beginner]
- [ ] [Article: "OBD2 Explained - A Simple Intro", CSS Electronics](https://www.csselectronics.com/pages/obd2-explained-simple-intro)
- [ ] [Article: "Unified Diagnostic Services", Wikipedia](https://en.wikipedia.org/wiki/Unified_Diagnostic_Services) [alt]

### ISO 26262 & Functional Safety for Vehicles

- [ ] [Article: "ISO 26262", Wikipedia](https://en.wikipedia.org/wiki/ISO_26262) [beginner]
- [ ] [Article: "Automotive Safety Integrity Level (ASIL)", Wikipedia](https://en.wikipedia.org/wiki/Automotive_Safety_Integrity_Level)

### Project Gate — The Safety Case: A BMS Node Under Test

> Take cellguard to where it would have to be for a real vehicle: a defensible state machine, latching faults, and a bench that replays real traffic to prove it.

**What you are building**

The full battery-management application on top of everything you have built, plus a
**HIL-style test bench** that replays recorded CAN traffic and asserts the node responds correctly
and within its deadline.

**Why this is worth showing**

This is the piece that maps directly onto EV and automotive roles. A state machine with **latching**
faults and an explicit clear path is exactly what functional-safety work looks like, and a replay
bench is how those teams actually test.

**Expected output**

```text
$ ./bench/replay.sh logs/overvoltage_event.log
t=0.000  IDLE      -> CHARGING     (charger present, all cells 3.6-4.0 V)
t=4.120  cell 7 = 4.251 V  (limit 4.20 V)
t=4.121  CHARGING  -> FAULT_OV     latched, contactor open, 1 ms after detect
t=4.121  ASSERT ok: reaction time 1.0 ms  (deadline 10 ms)
t=9.000  clear requested while cell still high -> REFUSED
t=31.40  cell 7 = 4.05 V, clear requested -> FAULT_OV -> IDLE

18 scenarios replayed: 18 passed
  overvoltage, undervoltage, overtemp, sensor dropout, CAN silence,
  contactor weld, watchdog starvation, brown-out during charge
```

**What makes it stand out**

The **fault table** in the README: every fault, its trigger threshold, its reaction deadline, what
the node does, and how it clears. One page. That table is the artefact a battery-systems engineer
will read first, and it shows you think about failure before features.

**Definition of done**

- [ ] Gate: Define the CAN message set: cell voltages, pack current, temperature, state
- [ ] Gate: Implement idle / charge / discharge / fault as an explicit state machine
- [ ] Gate: Make every fault latching, with a clear path that refuses while the cause persists
- [ ] Gate: Give every fault a detection threshold and a reaction deadline
- [ ] Gate: Add watchdog supervision that survives a hung task
- [ ] Gate: Build a replay bench that drives recorded CAN logs and asserts the outcome
- [ ] Gate: Cover at least 8 failure scenarios including sensor dropout and CAN silence
- [ ] Gate: Publish the fault table: trigger, deadline, reaction, clear condition

---

## Track C — Edge AI & TinyML

> Running inference on a microcontroller — where it makes sense and where it does not.

### ML Fundamentals

- [ ] [Article: "Introduction to Machine Learning for Coders!", course18.fast.ai](https://course18.fast.ai/ml) [beginner]
- [ ] [Article: "A beginner's guide to artificial intelligence and machine learning", ibm](https://developer.ibm.com/articles/cc-beginner-guide-machine-learning-ai-cognitive/)
- [ ] [Article: "Machine Learning Crash Course with TensorFlow APIs - Google", developers.google](https://developers.google.com/machine-learning/crash-course/)
- [ ] [Video: "Intro to Edge AI: Machine Learning + IoT – Maker.io Tutorial | Digi-Key Electronics", YouTube](https://www.youtube.com/watch?v=Ejld8XZmvwE)

### TensorFlow Lite for Microcontrollers

- [ ] [Video: "Getting Started with TensorFlow and Keras – Maker.io | Digi-Key Electronics", YouTube](https://www.youtube.com/watch?v=HCG3hFe1KYY)
- [ ] [Video: "Intro to TensorFlow Lite Part 1: Wake Word Feature Extraction – Maker.io | Digi-Key Electronics", YouTube](https://www.youtube.com/watch?v=0fn7pj7Dutc) [alt]
- [ ] [Video: "Intro to TensorFlow Lite Part 2: Speech Recognition Model Training – Maker.io | Digi-Key Electronics", YouTube](https://www.youtube.com/watch?v=yv_WVwr6OkI) [alt]

### TinyML

- [ ] [Video: "Intro to TinyML Part 1: Training a Neural Network for Arduino in TensorFlow | Digi-Key Electronics", YouTube](https://www.youtube.com/watch?v=BzzqYNYOcWc) [beginner]
- [ ] [Video: "Intro to TinyML Part 2: Deploying a TensorFlow Lite Model to Arduino | Digi-Key Electronics", YouTube](https://www.youtube.com/watch?v=dU01M61RW8s) [beginner] [alt]
- [ ] [Video: "TinyML: Getting Started with TensorFlow Lite for Microcontrollers | Digi-Key Electronics", YouTube](https://youtu.be/gDFWCxrJruQ) [alt]
- [ ] [Video: "TinyML: Getting Started with STM32 X-CUBE-AI | Digi-Key Electronics", YouTube](https://youtu.be/crJcDqIUbP4)
- [ ] [Book: "TinyML: Machine Learning with TensorFlow Lite on Arduino and Ultra-Low-Power Microcontrollers - Pete Warden, Daniel Situnayake", tinymlbook](https://tinymlbook.com/)

### Project Gate — Anomaly Detection That Fits In The Budget

> Add a tiny model that spots a failing cell - then report honestly whether it earns its flash.

**What you are building**

A small model that flags **anomalous cell behaviour** from the voltage and temperature history
cellguard already collects, quantised to int8 and running on the emulated MCU alongside everything
else.

**Why this is worth showing**

TinyML on a CV is usually a tutorial rerun on someone else's dataset. Attaching it to *your own*
firmware's real signal, and then measuring whether it fits, is engineering rather than a demo.

**Expected output**

```text
$ make ml-report
model: 3-layer MLP, 8x16x2, int8 quantised
  flash ............ 6.1 kB  (33% of remaining budget)
  RAM (arena) ...... 2.8 kB
  cycles/inference . 41 200  @16 MHz = 2.6 ms
  fits in 20 ms control period: YES (13% of budget)

accuracy on held-out cells:
  float32 .......... 94.2%
  int8 quantised ... 92.8%   (-1.4 pts)
  false positives .. 0.6%  <- a false fault trip is expensive
```

**What makes it stand out**

The honest verdict. Ending the README with *"a fixed threshold on dV/dt catches 89% of these for
40 bytes and 12 cycles, so the model is not justified on this part - it becomes worth it above N
cells"* shows more judgement than any accuracy number. Engineers who say when not to use a
technique get hired.

**Definition of done**

- [ ] Gate: Train an anomaly-detection model on the cell data your firmware produces
- [ ] Gate: Quantise to int8 and measure the accuracy you lost
- [ ] Gate: Run it on the emulated MCU with TensorFlow Lite Micro
- [ ] Gate: Measure flash, RAM arena and cycles per inference
- [ ] Gate: Check it fits inside your existing control period and say by how much
- [ ] Gate: Compare it against a simple threshold baseline on the same data
- [ ] Gate: State plainly whether the model is justified, and under what conditions

---

## Track D — DSP & Control

> The maths layer: filtering real signals and closing control loops. Moved to the Reference Shelf: PID.

### DSP Basics & Filter Design

- [ ] [Video: "FIR Filter Design and Software Implementation - Phil's Lab #17", YouTube](https://www.youtube.com/watch?v=uNNNj9AZisM)
- [ ] [Video: "IIR Filters - Theory and Implementation (STM32) - Phil's Lab #32", YouTube](https://www.youtube.com/watch?v=QRMe02kzVkA)
- [ ] [Video: "Digital Signal Processing (ECSE-4530) Lectures, Fall 2014 (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLuh62Q4Sv7BUSzx5Jr8Wrxxn-U10qG1et)
- [ ] [Book: "Introduction to Computer Music", composerprogrammer](https://composerprogrammer.com/introductiontocomputermusic.pdf) [extra]
- [ ] [Video: "Learn Embedded Systems Design on ARM based Microcontrollers 1 of 2", YouTube](https://www.youtube.com/watch?v=GFjA7wooCZ8) [extra]
- [ ] [Book: "The Scientist and Engineer's Guide to Digital Signal Processing - Steven W. Smith", dspguide](https://www.dspguide.com/pdfbook.htm) [reference]

### FFT

- [ ] [Video: "Discrete Fourier Transform - Simple Step by Step", YouTube](https://www.youtube.com/watch?v=mkGsMWi_j4Q)
- [ ] [Video: "The Fast Fourier Transform (FFT): Most Ingenious Algorithm Ever?", YouTube](https://youtu.be/h7apO7q16V0)
- [ ] [Video: "The FFT Algorithm - Simple Step by Step", YouTube](https://www.youtube.com/watch?v=htCj9exbGo0)
- [ ] [Video: "STM32 Fast Fourier Transform (CMSIS DSP FFT) - Phil's Lab #111", YouTube](https://youtu.be/d1KvgOwWvkM)
- [ ] [Video: "Digital Signal Processing (DSP) Tutorial - DSP with the Fast Fourier Transform Algorithm", YouTube](https://www.youtube.com/watch?v=HJ_-5mqUZ70) [extra]

### Filters (FIR & IIR)

- [ ] [Video: "IIR Filters - Audio DSP On STM32 with I2S (24 Bit / 96 kHz)", YouTube](https://www.youtube.com/watch?v=lNBrGOk0XzE)
- [ ] [Video: "FIR Filters - Audio DSP On STM32 (24 Bit / 48 kHz)", YouTube](https://www.youtube.com/watch?v=n9Cy1xkEf1E) [alt]

### Control Theory

- [ ] [Video: "Understanding Control Systems (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLn8PRpmsu08q8CE0pbZ-cSrMm_WYJfVGd) [alt]
- [ ] [Video: "Control Systems - CircuitBread (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLfYdTiQCV_p4YZNJWExM-5_g0fk9bHDL8) [alt]
- [ ] [Link: "Kalman Filter", kalmanfilter](https://kalmanfilter.net/)
- [ ] [Video: "Brian Douglas' Control Systems Lectures (YouTube Channel)", YouTube](https://www.youtube.com/@BrianBDouglas) [reference]

### Modelling & Simulation

- [ ] [Video: "MATLAB Tutorials: Getting Started with MATLAB (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PL7CAABC40B2825C8B)
- [ ] [Video: "Getting Started with Simulink (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PL484BA2AD3AE4C2D0) [alt]

### Project Gate — Estimation and Control, Inside The ISR

> Add the maths a battery system actually needs - a filter and a control loop - written in fixed point and proven to fit the time budget.

**What you are building**

Two things cellguard needs: a **fixed-point IIR filter** cleaning the noisy current signal, and a
**PID loop** driving balancing current, with anti-windup and output clamping. Both run inside a
timer ISR with a measured cycle cost.

**Why this is worth showing**

Fixed-point DSP without an FPU, verified against a float reference and measured against a deadline,
is a genuinely uncommon skill. Anti-windup in particular is the detail that separates someone who
has read about PID from someone who has run one.

**Expected output**

```text
$ make control-report
IIR biquad, Q15, fc=20 Hz @1 kHz
  max error vs float64 reference .... 0.031%
  cycles/sample ..................... 148   (9.3 us @16 MHz)

PID (kp=0.8 ki=0.12 kd=0.02), anti-windup: back-calculation
  step response: rise 240 ms, overshoot 4.1%, settle 620 ms
  saturated 8 s then released -> recovered in 310 ms (no windup)
  cycles/update ..................... 96    (6.0 us)

total in 1 kHz ISR: 15.3 us of 1000 us budget (1.5%)
```

**What makes it stand out**

The **saturation recovery plot**. Drive the actuator into its limit, hold it, release, and show the
loop recovering without the integrator having wound up. Put the with/without-anti-windup curves
side by side - it is one image that proves you understand the failure mode.

**Definition of done**

- [ ] Gate: Implement a fixed-point IIR filter and check it against a float reference
- [ ] Gate: Report the maximum error and the cycles per sample
- [ ] Gate: Implement a PID loop with anti-windup and output clamping
- [ ] Gate: Measure step response: rise time, overshoot and settling time
- [ ] Gate: Drive the output into saturation, release, and show recovery without windup
- [ ] Gate: Plot with and without anti-windup side by side
- [ ] Gate: Run both inside the timer ISR and report the fraction of the budget used

---

## Reference Shelf — Subjects That Are Their Own Course

> Not part of any stage. Each of these is a self-contained subject, a catalogue to
> pick from, or a link gallery — material you reach for when a specific job asks for
> it, not something you work through in order. Nothing here blocks progress.

### Editors, IDEs & PlatformIO — from Stage 0

- [ ] [Link: "Keil MDK & µVision", keil](https://www.keil.com/)
- [ ] [Link: "IAR Embedded Workbench", iar](https://www.iar.com)
- [ ] [Link: "STM32CubeIDE", st](https://www.st.com/en/development-tools/stm32cubeide.html)
- [ ] [Link: "Microchip Studio for AVR® and SAM Devices", microchip](https://www.microchip.com/en-us/tools-resources/develop/microchip-studio)
- [ ] [Link: "MPLAB® X IDE", microchip](https://www.microchip.com/en-us/tools-resources/develop/mplab-x-ide) [extra]
- [ ] [Link: "MCUXpresso IDE", nxp](https://www.nxp.com/design/software/development-software/mcuxpresso-software-and-tools-/mcuxpresso-integrated-development-environment-ide:MCUXpresso-IDE) [extra]
- [ ] [Link: "Cortex-Debug", marketplace.visualstudio](https://marketplace.visualstudio.com/items?itemName=marus25.cortex-debug) [extra]
- [ ] [Link: "STM32 VS Code Extension", marketplace.visualstudio](https://marketplace.visualstudio.com/items?itemName=stmicroelectronics.stm32-vscode-extension) [extra]
- [ ] [Link: "Espressif IDF", marketplace.visualstudio](https://marketplace.visualstudio.com/items?itemName=espressif.esp-idf-extension) [extra]
- [ ] [Link: "MCUXpresso for VS Code", marketplace.visualstudio](https://marketplace.visualstudio.com/items?itemName=NXPSemiconductors.mcuxpresso) [extra]
- [ ] [Link: "PlatformIO - A professional collaborative platform for embedded development", platformio](https://platformio.org/) [extra]
- [ ] [Link: "Visual Studio Code", code.visualstudio](https://code.visualstudio.com/) [extra]
- [ ] [Link: "VisualGDB", visualgdb](https://visualgdb.com/) [extra]

### Where to Look Things Up — from Stage 0

- [ ] [Link: "DeepBlueMbedded", deepbluembedded](https://deepbluembedded.com/)
- [ ] [Link: "Digital Electronics Deeds", digitalelectronicsdeeds](https://www.digitalelectronicsdeeds.com/index.html)
- [ ] [Link: "ElectronicWings - Hardware Developers Community", electronicwings](https://www.electronicwings.com/) [extra]
- [ ] [Link: "EduTecnica (Italian)", edutecnica.it](https://www.edutecnica.it/) [extra]
- [ ] [Link: "Microchip University", Microchip University](https://mu.microchip.com/) [extra]
- [ ] [Link: "Nordic Developer Academy", Nordic Academy](https://academy.nordicsemi.com/) [extra]
- [ ] [Link: "Electronics Tutorials", electronics-tutorials.ws](https://www.electronics-tutorials.ws) [extra]
- [ ] [Link: "SparkFun Learn: Learn at SparkFun Electronics", sparkfun](https://learn.sparkfun.com/) [extra]
- [ ] [Link: "Adafruit Learning System", adafruit](https://learn.adafruit.com/) [extra]
- [ ] [Link: "STM32 World", stm32world](https://stm32world.com) [extra]
- [ ] [Link: "ControllersTech", controllerstech](https://controllerstech.com/) [extra]
- [ ] [Link: "Embedded Systems News - CNX Software", cnx-software](https://www.cnx-software.com/) [extra]
- [ ] [Link: "News - PioLabs", piolabs](https://piolabs.com/) [extra]
- [ ] [Link: "Interrupt Blog by Memfault", Memfault Interrupt](https://interrupt.memfault.com/blog/) [reference]
- [ ] [Link: "EmbeddedRelated.com", EmbeddedRelated](https://www.embeddedrelated.com/) [reference]

### Starter Projects — from Stage 0

- [ ] [Link: "Random Nerd Tutorials | Learn ESP32, ESP8266, Arduino, and Raspberry Pi", randomnerdtutorials](https://randomnerdtutorials.com/)
- [ ] [Link: "Last Minute Engineers", lastminuteengineers](https://lastminuteengineers.com/)
- [ ] [Link: "51 STM32 Projects & Tutorials for Beginners and Up - Hackster.io", hackster](https://www.hackster.io/stm32/projects)
- [ ] [Link: "STM32 (STM32F103C8) Projects & Tutorials", circuitdigest](https://circuitdigest.com/stm32-projects-and-tutorials) [alt]
- [ ] [Link: "ElectronicWings Projects", electronicwings](https://www.electronicwings.com/projects)
- [ ] [Link: "STM32 Firmware - Phil’s Lab (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLXSyc11qLa1a4Tqbz228dPZfMrs-KRpzA) [extra]
- [ ] [Link: "Raspberry Pi Based Embedded Project Ideas", rs-online](https://www.rs-online.com/designspark/raspberry-pi-based-embedded-project-ideas) [extra]
- [ ] [Link: "Embedded Linux On ARM | Projects", emertxe](https://www.emertxe.com/embedded-systems/embedded-linux-on-arm/elarm-projects/) [extra]
- [ ] [Link: "Embedded System Project Series - Artful Bytes (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLS_iNJJVTtiRV0DZRDcTHnvAuDrKGPN40) [extra]
- [ ] [Link: "ESP32 ESP-IDF Tutorials & IoT Protocols", esp32tutorials](https://esp32tutorials.com/) [extra]
- [ ] [Link: "flip-card", GitHub](https://github.com/Nicholas-L-Johnson/flip-card) [extra]
- [ ] [Link: "Getting Started with Arduino", arduino.cc](https://docs.arduino.cc/learn/starting-guide/getting-started-arduino) [extra]
- [ ] [Link: "ArduinoMap (Open-source Arduino course)", arduinomap](https://arduinomap.me/) [extra]
- [ ] [Video: "All New Arduino R4 WiFi LESSONS for Absolute Beginners (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLGs0VKk2DiYyn0wN335MXpbi3PRJTMmex) [extra]
- [ ] [Video: "New Arduino Tutorials (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLGs0VKk2DiYw-L-RibttcvK-WBZm8WLEP) [extra]
- [ ] [Video: "Arduino in a commercial product?", YouTube](https://www.youtube.com/watch?v=c5LzsqeSCAc) [extra]
- [ ] [Video: "Arduino Project to Product (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLEBQazB0HUyQd6Fsf5NQ75M9llbi1_j_8) [extra]

### Register-Level Drills (MSP430 walkthroughs) — from Stage 3

- [ ] [Video: "MSP430 - Digital Inputs & Polling", YouTube](https://www.youtube.com/watch?v=_6tTvj_D2UA&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=73)
- [ ] [Video: "MSP430 - Digital Outputs", YouTube](https://www.youtube.com/watch?v=phxF_q44G1Y&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=72)
- [ ] [Video: "Timer Overflow using ACLK", YouTube](https://www.youtube.com/watch?v=lha1L3JYBfM&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=75)
- [ ] [Video: "Timer Overflow using ACLK + 12-Bit Counter Length", YouTube](https://www.youtube.com/watch?v=SdqMQXeV09E&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=76) [alt]
- [ ] [Video: "Timer Overflow using SMCLK", YouTube](https://www.youtube.com/watch?v=bZqTRS456FI&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=77) [alt]
- [ ] [Video: "Timer Overflow using SMCLK + Divide-by-4 PreScalar", YouTube](https://www.youtube.com/watch?v=Qde97beYaVs&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=78)
- [ ] [Video: "Timer Compares", YouTube](https://www.youtube.com/watch?v=-93ZQVd-ELg&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=79) [extra]
- [ ] [Video: "Timer Captures", YouTube](https://www.youtube.com/watch?v=yQduo9dM_ig&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=81) [extra]
- [ ] [Video: "Overview of ADCs", YouTube](https://www.youtube.com/watch?v=ZwThTeZnTEk&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=111) [extra]
- [ ] [Video: "The MSP430 ADC & Configuration", YouTube](https://www.youtube.com/watch?v=l__XaxTco6I&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=112) [extra]
- [ ] [Video: "Reading Voltage w/ Conversion-Complete Polling", YouTube](https://www.youtube.com/watch?v=HH9DO22BxU4&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=113) [extra]
- [ ] [Video: "Reading Voltage w/ Conversion-Complete IRQ", YouTube](https://www.youtube.com/watch?v=n0YBaQKZoJ4&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=114) [extra]
- [ ] [Video: "Reading Voltage w Conversion-Complete IRQ & LPM", YouTube](https://www.youtube.com/watch?v=IiTJzawSwE0&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=115) [extra]
- [ ] [Video: "Overview and Basic Concepts", YouTube](https://www.youtube.com/watch?v=EqaKOg5HiaU&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=47kj) [extra]
- [ ] [Video: "Interrupts Overview & Port Interrupt Example", YouTube](https://www.youtube.com/watch?v=3duicvNsBqo&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=74) [extra]
- [ ] [Video: "Overview of the Interrupt Vector Table", YouTube](https://www.youtube.com/watch?v=NoBGeTqtj3g&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=48) [extra]
- [ ] [Video: "The use of the STACK during an IRQ + Nested IRQs", YouTube](https://www.youtube.com/watch?v=FMVhk1NrlRs&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=49) [extra]
- [ ] [Video: "The Responsibility of the Developer when using IRQs", YouTube](https://www.youtube.com/watch?v=Ua9Rn08kGaE&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=50) [extra]
- [ ] [Video: "The IRQs on the MSP430FR2355 MCU", YouTube](https://www.youtube.com/watch?v=E84jZj0Nqk8&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=51) [extra]
- [ ] [Video: "Port Interrupts on the MSP430FR2355 MCU - Overview", YouTube](https://www.youtube.com/watch?v=ASLzzwbagmE&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=52) [extra]
- [ ] [Video: "Reading from a Switch Using a Port IRQ Program Example", YouTube](https://www.youtube.com/watch?v=zeOZi85T9EI&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=53) [extra]
- [ ] [Video: "Changing Edge Sensitivity (PxIES) & Forgetting to Clear a Flag", YouTube](https://www.youtube.com/watch?v=xeBcOe7ZeiM&list=PL643xA3Ie_EuHoNV7AgvJXq-z1hrE8vsm&index=54) [extra]

### Long-Range & Mesh (LoRa, Zigbee, Thread, Matter) — from Stage 4

- [ ] [Article: "The Arduino Guide to LoRa® and LoRaWAN®", arduino.cc](https://docs.arduino.cc/learn/communication/lorawan-101)
- [ ] [Article: "What are LoRa® and LoRaWAN®?", lora-developers.semtech](https://lora-developers.semtech.com/documentation/tech-papers-and-guides/lora-and-lorawan/)
- [ ] [Video: "#112 LoRa / LoRaWAN De-Mystified / Tutorial", YouTube](https://www.youtube.com/watch?v=hMOwbNUpDQA) [alt]
- [ ] [Link: "ESP32 with LoRa using Arduino IDE – Getting Started", randomnerdtutorials](https://randomnerdtutorials.com/esp32-lora-rfm95-transceiver-arduino-ide/)
- [ ] [Video: "What is ZIGBEE And How It Works?", YouTube](https://www.youtube.com/watch?v=THtVeaxnd9E) [extra]
- [ ] [Video: "How to take advantage of Zigbee and Bluetooth LE 5.2 on STM32WB wireless MCUs - Webinar Replay", YouTube](https://www.youtube.com/watch?v=2sYEPykOaLQ) [extra]
- [ ] [Link: "OpenThread - An open-source implementation of Thread®", openthread](https://openthread.io/) [extra]
- [ ] [Video: "What is Thread? Low-power IoT Networking for Smart Home Devices | Digi-Key Electronics", YouTube](https://youtu.be/5CauESYB9-A) [extra]
- [ ] [Link: "OpenThread - ESP-IDF Programming Guide", Espressif](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/openthread.html) [extra]
- [ ] [Video: "What is Matter? Unifying IoT Devices for the Smart Home | Digi-Key Electronics", YouTube](https://youtu.be/vJIEfih9bl0) [extra]
- [ ] [Link: "The Things Fundamentals on LoRaWAN!", thethingsnetwork](https://www.thethingsnetwork.org/docs/lorawan/) [reference]

### Other RTOSes Worth Knowing — from Stage 5

- [ ] [Link: "NuttX - The Apache Software Foundation", nuttx.apache](https://nuttx.apache.org/)
- [ ] [Link: "NuttX Documentation", nuttx.apache](https://nuttx.apache.org/docs/latest/)
- [ ] [Video: "Getting Started to NuttX (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLd73yQk5Fd8JEsVD-lhwYRQKVu6glfDa8)
- [ ] [Link: "RT-Thread | An Open Source Embedded Real-time Operating System", rt-thread](https://www.rt-thread.io/) [extra]
- [ ] [Link: "RT-Thread document center", rt-thread](https://www.rt-thread.io/document/site/) [extra]
- [ ] [Video: "RT-Thread Beginners Guide (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLXUV89C_M3G5KVw2IerI-pqApdSM_IaZo) [alt]
- [ ] [Link: "Micriμm OS", silabs](https://www.silabs.com/developers/micrium) [extra]
- [ ] [Link: "µC/OS-III Documentation", micrium.atlassian](https://micrium.atlassian.net/wiki/spaces/osiiidoc/overview) [extra]
- [ ] [Book: "µC/OS-III Books", weston-embedded](https://weston-embedded.com/micrium-books) [extra]
- [ ] [Link: "Mbed OS", os.mbed](https://os.mbed.com/mbed-os/) [extra]
- [ ] [Link: "Mbed OS Documentation", os.mbed](https://os.mbed.com/docs/mbed-os/) [extra]
- [ ] [Link: "Azure RTOS - Making embedded IoT development and connectivity easy", azure.microsoft](https://azure.microsoft.com/en-us/services/rtos/) [extra]
- [ ] [Link: "Microsoft Azure RTOS documentation", microsoft](https://learn.microsoft.com/en-us/azure/rtos/) [extra]
- [ ] [Link: "Azure RTOS ThreadX", GitHub](https://github.com/azure-rtos/threadx) [extra]
- [ ] [Link: "BlackBerry QNX: Embedded OS, Support, and Services", blackberry.qnx](https://blackberry.qnx.com/en) [extra]
- [ ] [Link: "QNX Product Documentation", qnx](https://www.qnx.com/developers/docs/index.html) [extra]
- [ ] [Link: "VxWorks | Industry Leading RTOS for Embedded Systems", windriver](https://www.windriver.com/products/vxworks) [extra]
- [ ] [Link: "VxWorks Documentation", windriver](https://docs.windriver.com/category/os_vxworks?labelkey=os_vxworks) [extra]
- [ ] [Video: "VxWORKS-RTOS - Kumar M (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLyp1I7W35-q34sYWBlBg8xgoqsizZ57P7) [alt]
- [ ] [Book: "µC/OS-II Documentation (Previously published as a book titled 'MicroC/OS-II: The Real-Time Kernel')", micrium.atlassian](https://micrium.atlassian.net/wiki/spaces/osiidoc/overview) [reference]

### PID — from Track D

- [ ] [Video: "What is a PID Controller? | DigiKey", YouTube](https://www.youtube.com/watch?v=tFVAaUcOm4I) [beginner]
- [ ] [Video: "How to Tune a PID Controller for an Inverted Pendulum | DigiKey", YouTube](https://www.youtube.com/watch?v=hRnofMxEf3Q) [beginner] [alt]
- [ ] [Video: "PID Controller Explained", YouTube](https://www.youtube.com/watch?v=fv6dLTEvl74) [alt]
- [ ] [Video: "Understanding PID Control (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLn8PRpmsu08pQBgjxYFXSsODEF3Jqmm-y)
- [ ] [Video: "PID Controller Implementation in Software - Phil's Lab #6", YouTube](https://www.youtube.com/watch?v=zOByx3Izf5U)
- [ ] [Video: "Part 1: What is PID Control?", YouTube](https://www.youtube.com/watch?v=wkfEZmsQqiA) [alt]
- [ ] [Video: "Part 2: Expanding Beyond a Simple Integral", YouTube](https://www.youtube.com/watch?v=NVLXCwc8HzM)
- [ ] [Video: "Part 3: Expanding Beyond a Simple Derivative", YouTube](https://www.youtube.com/watch?v=7dUVdrs1e18) [extra]
- [ ] [Video: "Part 4: A PID Tuning Guide", YouTube](https://www.youtube.com/watch?v=sFOEsA0Irjs) [extra]
- [ ] [Video: "Part 5: Three Ways to Build a Model", YouTube](https://www.youtube.com/watch?v=qhIjIu-Zk10) [extra]
- [ ] [Video: "Part 6: Manual and Automatic Tuning Methods", YouTube](https://www.youtube.com/watch?v=qj8vTO1eIHo) [extra]
- [ ] [Video: "Part 7: Important PID Concepts", YouTube](https://www.youtube.com/watch?v=tbgV6caAVcs) [extra]
- [ ] [Video: "Part 1: Setting Up the Control Problem", YouTube](https://www.youtube.com/watch?v=hGcGPUqB67Q) [extra]
- [ ] [Video: "Part 2: How Do You Get a Drone to Hover?", YouTube](https://www.youtube.com/watch?v=GK1t8YIvGM8) [extra]
- [ ] [Video: "Part 3: How to Build the Flight Code", YouTube](https://www.youtube.com/watch?v=3Gtb5Eq1Lvk) [extra]
- [ ] [Video: "Part 4: How to Build a Model for Simulation", YouTube](https://www.youtube.com/watch?v=gEmGfo36INc) [extra]
- [ ] [Video: "Part 5: Tuning the PID controller", YouTube](https://www.youtube.com/watch?v=BqrRfoH-19s) [alt]

### C++ for Embedded — from Appendix

- [ ] [Video: "C++ Tutorial for Beginners - Full Course", YouTube](https://www.youtube.com/watch?v=vLnPwxZdW4Y) [beginner]
- [ ] [Video: "The Essence of C++ by Bjarne Stroustrup - YouTube", YouTube](https://www.youtube.com/watch?v=86xWVb4XIyE) [beginner] [alt]
- [ ] [Video: "Delivering Safe C++ by Bjarne Stroustrup - CppCon 2023", YouTube](https://www.youtube.com/watch?v=I8UvQKvOSSw) [beginner] [alt]
- [ ] [Video: "The Design of C++ by Bjarne Stroustrup Computer History - YouTube", YouTube](https://www.youtube.com/watch?v=69edOm889V4) [beginner] [alt]
- [ ] [Article: "Modern C++ in Embedded Development: (Don't Fear) The ++", EmbeddedRelated](https://www.embeddedrelated.com/showarticle/1532.php) [extra]
- [ ] [Article: "C++ On Embedded Systems", mbedded.ninja](https://blog.mbedded.ninja/programming/languages/c-plus-plus/cpp-on-embedded-systems/) [extra]
- [ ] [Video: "C++ by The Cherno (YouTube Playlist)", YouTube](https://youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb) [alt]
- [ ] [Article: "Bare Metal C++ - Alexey Rybachuk", arobenko.github](https://arobenko.github.io/bare_metal_cpp/) [reference]
- [ ] [Video: "C++ in Constrained Environments - Bjarne Stroustrup - CppCon 2022", YouTube](https://www.youtube.com/watch?v=2BuJjaGuInI) [reference]
- [ ] [Video: "CppCon Conferences - YouTube", YouTube](https://www.youtube.com/@CppCon/playlists) [reference]

### Rust for Embedded — from Appendix

- [ ] [Article: "5 roadblocks to Rust adoption in embedded systems", Embedded.com](https://www.embedded.com/5-roadblocks-to-rust-adoption-in-embedded-systems/)
- [ ] [Link: "The Embedded Rust Book", rust-embedded](https://docs.rust-embedded.org/book/)
- [ ] [Video: "The Future of Programming: Rust (YouTube Playlist)", YouTube](https://www.youtube.com/playlist?list=PLc7W4b0WHTAUAEAguiqpNa5H0QqXJIJI6)
- [ ] [Link: "Community Rust support projects for STM32 microcontrollers", GitHub](https://github.com/stm32-rs)
- [ ] [Link: "Rust on ESP Community", GitHub](https://github.com/esp-rs) [extra]
- [ ] [Video: "Embedded Rust su ESP32 (Italian) - YouTube Playlist", YouTube](https://www.youtube.com/playlist?list=PLT--ndZEB54ek5_Zv6x6WCioh5m35zh5i) [alt]
- [ ] [Article: "Rust on STM32: Getting started", jonathanklimt.de](https://jonathanklimt.de/electronics/programming/embedded-rust/rust-on-stm32-2/) [extra]
- [ ] [Article: "From Zero to main(): Bare metal Rust", Memfault Interrupt](https://interrupt.memfault.com/blog/zero-to-main-rust-1) [extra]
- [ ] [Link: "Rustlings - Small exercises to get you used to reading and writing Rust code!", rustlings.cool](https://rustlings.cool/) [extra]
- [ ] [Link: "Learn Rust the Effective Way", rustfinity](https://www.rustfinity.com/) [extra]

### Python for Tooling & Test — from Appendix

- [ ] [Article: "The Python Handbook – Learn Python for Beginners", freecodecamp](https://www.freecodecamp.org/news/the-python-handbook/) [beginner]
- [ ] [Article: "Python for embedded systems testing", elsys-design](https://www.elsys-design.com/en/python-embedded-systems-testing/)
- [ ] [Link: "MicroPython - Python for microcontrollers", micropython](https://micropython.org/)
- [ ] [Link: "MicroPython 101 | Arduino Documentation", arduino.cc](https://docs.arduino.cc/micropython-course/) [alt]
- [ ] [Link: "CircuitPython", circuitpython](https://circuitpython.org/) [extra]
- [ ] [Article: "The Pros and Cons of Designing Embedded Systems with MicroPython", designnews](https://www.designnews.com/electronics-test/pros-and-cons-designing-embedded-systems-micropython) [extra]
- [ ] [Article: "Programming the ESP32 with MicroPython", wolles-elektronikkiste.de](https://wolles-elektronikkiste.de/en/programming-the-esp32-with-micropython) [extra]
- [ ] [Link: "Real Python: Python Tutorials", realpython](https://realpython.com/) [reference]

### Zig — from Appendix

- [ ] [Article: "Testing Zig for embedded development", kuon.ch](https://www.kuon.ch/post/2022-06-22-zig-embed/)
- [ ] [Link: "Zig Embedded Group", GitHub](https://github.com/ZigEmbeddedGroup)
- [ ] [Link: "MicroZig - Unified abstraction layer and HAL for several microcontrollers", GitHub](https://github.com/ZigEmbeddedGroup/microzig)
- [ ] [Article: "Zig Bare Metal Programming on STM32F103 — Booting up", maldus512.medium](https://maldus512.medium.com/zig-bare-metal-programming-on-stm32f103-booting-up-b0ecdcf0de35)

---

## Appendix — The Only Books Worth Buying

> Everything above is free. If you buy anything at all, these three earn their price.
> They are optional and nothing in the syllabus depends on them.

- [ ] [Book: "The C Programming Language (K&R)", Kernighan & Ritchie](https://en.wikipedia.org/wiki/The_C_Programming_Language) [optional-paid]
- [ ] [Book: "Test Driven Development for Embedded C", James Grenning](https://pragprog.com/titles/jgade/test-driven-development-for-embedded-c/) [optional-paid]
- [ ] [Book: "Making Embedded Systems", Elecia White](https://www.oreilly.com/library/view/making-embedded-systems/9781098151539/) [optional-paid]

---

## Credits & Licence

This syllabus is a derivative work. It reorganises, filters and annotates material from:

- **[Embedded Engineering Roadmap](https://github.com/m3y54m/embedded-engineering-roadmap)** by Meysam Parvizi — licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- The original `README.md` resource list in this repository.

**Changes made:** resources were re-sequenced into staged modules with project gates; 
hardware-engineering topics (electronics, PCB, EMC, soldering, FPGA) were removed; all 
paid resources were removed except three optional books; the two source lists were 
merged and de-duplicated; an emulator-first Stage 0 was added.

As required by ShareAlike, **this document is also licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)**.

_Generated by `tools/buildSyllabus.js` — edit `tools/syllabusMap.js` and re-run to change the course._
