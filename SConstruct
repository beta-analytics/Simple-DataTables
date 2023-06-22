from SCons.Script import (
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
    # 'minify'    : True, # Minified version exports x as Datatable
    'bundle'    : True,
    'sourcemap' : GetOption('dev'),
    'watch'     : GetOption('dev'),
    'target'    : 'chrome90,firefox90,edge90,safari15',
    'allow-overwrite' : True,
}


def genOpts(**kwargs):
    opts = { **OPTS_esbuild, **kwargs }
    return ' '.join(
        '--' + k + ('' if v is True else '=' + v)
        for k, v in opts.items()
        if v
    )


build_esm = Command(
    'dist/std.mjs',
    ['src/index.js'],
    'esbuild {raw} {opts} --sourcemap=inline --outfile={out}'.format(
        raw  = '${SOURCES}',
        opts = genOpts(format='esm'),
        out  = '${TARGET}'
    )
)

build_cjs = Command(
    'dist/sdt.cjs',
    ['src/index.js'],
    'esbuild {raw} {opts} --sourcemap=inline --outfile={out}'.format(
        raw  = '${SOURCES}',
        opts = genOpts(format='cjs'),
        out  = '${TARGET}'
    )
)


build_js = Command(
    'dist/sdt.min.js',
    [build_cjs],
    'browserify {raw} --minify --standalone simpleDatatables -o {out}'.format(
        raw  = '${SOURCES}',
        out  = '${TARGET}',
    )
)


build_css = Command(
    'dist/sdt.min.css',
    ['src/style.css'],
    'esbuild --bundle {raw} --minify --outfile={out}'.format(
        raw  = 'src/style.css',
        out  = '${TARGET}'
    )
)

css = Alias('css', build_css)
js = Alias('js', build_js)
esm = Alias('esm', build_esm)

Default(css, js)
