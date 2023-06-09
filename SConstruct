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
    'format'    : 'esm',
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
    'dist/cjs/index.mjs',  # export file for scons
    ['src/index.js'],  # source file
    '/opt/homebrew/bin/esbuild --sourcemap=inline {raw} {opts} --outfile={out} --watch'.format(
        raw  = 'src/index.js',
        opts = genOpts(),
        out  = 'dist/cjs/index.mjs'
    )
)


js = Command(
    'dist/index.js',  # export file for scons
    [cjs],  # source file
    'browserify {raw} --minify --standalone simpleDatatables -o {out}'.format( # noqa 401
        raw  = 'dist/cjs/index.cjs',
        out  = 'dist/sdt.min.js'
    )
)


css = Command(
    'dist/sdt.min.css', # export file for scons
    ['src/style.css'], # source file
    '/opt/homebrew/bin/esbuild --bundle {raw} --minify --outfile={out}'.format(
        raw  = 'src/style.css',
        out  = 'dist/sdt.min.css'
    )
)

build_css = Command('build-css', [css], 'echo successfully built')
build_js = Command('build-js', [cjs], 'echo successfully built')

Default(build_js, build_css)
