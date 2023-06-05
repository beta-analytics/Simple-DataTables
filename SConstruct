from SCons.Script import (
    AddOption,
    Command,
    Default,
    GetOption,
)

AddOption(
    '--dev',
    action  = 'store_true',
    help    = 'installation prefix',
    default = False,
)

OPTS_esbuild = {
    # 'minify'    : True, # Minified version exports x as Datatable
    'bundle'    : True,
    'format'    : 'cjs',
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


cjs = Command(
    'dist/cjs/index.cjs',  # export file for scons
    ['src/index.js'],  # source file
    'esbuild {raw} {opts} --outfile={out}'.format( # add --watch when in build mode
        raw  = 'src/index.js',
        opts = genOpts(),
        out  = 'dist/cjs/index.cjs'
    )
)


js = Command(
    'dist/index.js',  # export file for scons
    [cjs],  # source file
    'browserify {raw} --minify --standalone simpleDatatables -o {out}'.format(
        raw  = 'dist/cjs/index.cjs',
        out  = 'dist/sdt.min.js',
    )
)


css = Command(
    'dist/sdt.min.css',  # export file for scons
    ['src/style.css'],  # source file
    'esbuild --bundle {raw} --minify --outfile={out}'.format(
        raw  = 'src/style.css',
        out  = 'dist/sdt.min.css'
    )
)

build_css = Command('build-css', [css], 'echo successfully built')
build_js = Command('build-js', [js], 'echo successfully built')
Default(build_js, build_css)
