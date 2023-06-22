from SCons.Script import (
    Alias,
    AddOption,
    Command,
    Default,
    GetOption,
)

AddOption(
    '--dev',
    action  = 'store_true',
    help    = 'installation prefix'
)

OPTS_esbuild = {
    'bundle'    : True,
    'sourcemap' : GetOption('dev'),
    'watch'     : GetOption('dev'),
    'target'    : 'chrome90,firefox90,edge90,safari15',
}


def genOpts(**kwargs):
    opts = { **OPTS_esbuild, **kwargs }
    return ' '.join(
        '--' + k + ('' if v is True else '=' + v)
        for k, v in opts.items()
        if v
    )


build_esm = Alias('esm', Command(
    'dist/std.mjs',
    ['src/index.js'],
    'esbuild {raw} {opts} --sourcemap=inline --outfile={out}'.format(
        raw  = '${SOURCES}',
        opts = genOpts(format='esm'),
        out  = '${TARGET}'
    )
))

build_cjs = Command(
    'dist/sdt.cjs',
    ['src/index.js'],
    'esbuild {raw} {opts} --sourcemap=inline --outfile={out}'.format(
        raw  = '${SOURCES}',
        opts = genOpts(format='cjs'),
        out  = '${TARGET}'
    )
)


build_js = Alias('js', Command(
    'dist/sdt.min.js',
    [build_cjs],
    'browserify {raw} --minify --standalone simpleDatatables -o {out}'.format(
        raw  = '${SOURCES}',
        out  = '${TARGET}',
    )
))


build_css = Alias('css', Command(
    'dist/sdt.min.css',
    ['src/style.css'],
    'esbuild --bundle {raw} --minify --outfile={out}'.format(
        raw  = 'src/style.css',
        out  = '${TARGET}'
    )
))

Command('build', [build_js, build_css], '@echo build successful')
Default(build_esm)
